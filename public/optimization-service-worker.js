// inspired by https://calendar.perfplanet.com/2018/dynamic-resources-browser-network-device-memory/

console.log('Service worker running')

self.addEventListener('fetch', event => {
  if (/\.jpg$|.png$|.gif$/.test(event.request.url)) {
    event.respondWith(fetchImage(event.request));
  }  
})

async function fetchImage(request) {
  const {pathname: imageName} = new URL(request.url)
    const quality = shouldReturnLowQuality(request) ? 'q_10' : 'q_auto'

    const cloudinaryUrl = `https://res.cloudinary.com/simone/image/upload/${quality},f_auto${imageName}`;

    const controller = new AbortController()

    const fetchPromise = fetch(cloudinaryUrl, { signal: controller.signal });

    const timer = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetchPromise

      return response.ok ? fetchPromise : fetch(request.url)
    } catch(err) {
      return fetch(request.url)
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
