/* eslint-disable no-restricted-globals */
// inspired by https://calendar.perfplanet.com/2018/dynamic-resources-browser-network-device-memory/

console.log('Service worker running')

self.addEventListener('install', event => {
  console.log('Service worker installed')
  const data = new URL(self.location).searchParams.get('data')

  self.data = JSON.parse(data)
})

self.addEventListener('activate', () => {
  console.log('Service worker activated')
})

self.addEventListener('message', event => {
  event.ports[0].postMessage('hey!')
})

self.addEventListener('fetch', async event => {
  if (event.request.destination === 'image') {
    event.respondWith(fetchImage(event))
  }  
})

const findBreakpoint = goal => self.data
.reduce((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);

async function fetchImage(event) {
  const url = new URL(event.request.url)

  const size = await new Promise(async (resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = event => resolve(event.data)

    const client = await self.clients.get(event.clientId)

    const id = Number(url.searchParams.get('id'))

    client.postMessage({ 
      type: 'IMG_SIZE_QUERY',
      id
    }, [channel.port2])
  })

  const width = size && findBreakpoint(size.width)

  const {pathname: imageName} = url
    const quality = shouldReturnLowQuality(event.request) ? 'q_10' : 'q_auto'

    const cloudinaryUrl = `https://res.cloudinary.com/simone/image/upload/${quality}${width ? `,w_${width}` : ''},f_auto${imageName}`;

    console.log('Requesting cloudinary image', cloudinaryUrl)

    const controller = new AbortController()

    const fetchPromise = fetch(cloudinaryUrl, { signal: controller.signal });

    const timer = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetchPromise

      return response.ok ? fetchPromise : fetch(event.request.url)
    } catch(err) {
      return fetch(event.request.url)
    } finally {
      clearTimeout(timer)
    }
}

function shouldReturnLowQuality(request){
  if ( (request.headers.get('save-data')) // Save Data is on
    || (navigator.connection.effectiveType.match(/2g/)) // Looks like a 2G connection
    || (navigator.deviceMemory < 1) // We have less than 1G of RAM
  ){
    return true;
  }

  return false;
}
