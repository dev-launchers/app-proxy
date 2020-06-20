addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  var reqURL = new URL(request.url);
  const hostname = reqURL.hostname;
  const subdomain = hostname.split(".")[0];
  var proxyBaseURL = await APP_MAPPER.get(subdomain);
  if (proxyBaseURL == null) {
    return new Response(
      `No app ${subdomain}`,
      { "status": 404, "statusText": "Not Found" },
    )
  }
  var proxyURL = new URL(proxyBaseURL + reqURL.pathname);
  const proxyReq = new Request(
    proxyURL,
    {
      method: request.method,
      headers: request.headers,
    },
  );
  const resp = await fetch(proxyReq)
    .then(resp => {
      return resp
    })
    .catch(err => {
      console.log(err);
      return new Response(
        `Failed to proxy to app ${subdomain}`,
        { "status": 500, "statusText": "Internal Server Error" },
      )
    });
  return resp
}
