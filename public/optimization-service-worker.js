/* eslint-disable no-restricted-globals */
// inspired by https://calendar.perfplanet.com/2018/dynamic-resources-browser-network-device-memory/

self.addEventListener('install', event => {
  console.log('Service worker installed')
  const config = new URL(self.location).searchParams.get('config')

  self.config = JSON.parse(config)
})

self.addEventListener('activate', () => {
  console.log('Service worker activated')
})

self.addEventListener('fetch', async event => {
  if (event.request.destination === 'image') {
    const url = new URL(event.request.url)
    const imageId = url.searchParams.get('__id')

    if (!imageId) return

    event.respondWith(fetchImage(event, url, imageId))
  }
})

async function fetchImage(event, url, imageId) {
  const { pathname: imageName } = url

  const size = await tryGetSize(event, imageId)
  const width = size && findBreakpoint(size.width)
  const quality = shouldReturnLowQuality(event.request) ? 'q_10' : 'q_auto'
  const imageUrl = `${self.config.baseCloudinaryUrl}/${quality}${
    width ? `,w_${width}` : ''
  },f_auto${imageName}`

  const client = await getClient(event)

  client.postMessage({
    type: 'IMG_QUERY',
    id: imageId,
    originalUrl: event.request.url,
    resolvedUrl: imageUrl,
    quality,
    detectedWidth: size && size.width,
    width
  })

  const controller = new AbortController()
  const fetchPromise = fetch(imageUrl, { signal: controller.signal })
  const timer = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetchPromise

    if (response.ok) {
      client.postMessage({
        type: 'IMG_QUERY_SUCCESS',
        id: imageId
      })

      return fetchPromise
    }

    client.postMessage({
      type: 'IMG_QUERY_FAILURE',
      id: imageId
    })

    return fetchOriginal(event)
  } catch (err) {
    client.postMessage({
      type: 'IMG_QUERY_FAILURE',
      id: imageId
    })

    return fetchOriginal(event)
  } finally {
    clearTimeout(timer)
  }
}

function fetchOriginal(event) {
  return fetch(event.request.url)
}

function tryGetSize(event, imageId) {
  return new Promise(async (resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = event => resolve(event.data)

    const client = await getClient(event)

    client.postMessage(
      {
        type: 'IMG_SIZE_QUERY',
        id: imageId
      },
      [channel.port2]
    )
  })
}

const findBreakpoint = target =>
  self.config.breakpoints.reduce((prev, curr) =>
    Math.abs(curr - target) <= Math.abs(prev - target) ? curr : prev
  )

async function getClient(event) {
  return self.clients.get(event.clientId)
}

function shouldReturnLowQuality(request) {
  if (
    request.headers.get('save-data') || // Save Data is on
    navigator.connection.effectiveType.match(/2g/) || // Looks like a 2G connection
    navigator.deviceMemory < 1 // We have less than 1G of RAM
  ) {
    return true
  }

  return false
}
