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
  const updateMappingSubdomain = await APP_MAPPER.get("updateMappingSubdomain");
  const subdomain = hostname.split(".")[0];
  if (subdomain == updateMappingSubdomain) {
    return updateMapping(request, subdomain)
  }
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

async function updateMapping(request, subdomain) {
  const body = await request.json();
  const updateMappingSecret = await APP_MAPPER.get("updateMappingSecret");
  if (updateMappingSecret != body.token) {
    return new Response(
      `Token mismatch`,
      { "status": 401, "statusText": "Unauthorized" },
    )
  }
  const appName = body.appName;
  if (appName == null) {
    return new Response(
      `Expect appName in request body`,
      { "status": 400, "statusText": "Bad Request" },
    )
  }
  const newHostname = body.hostname;
  if (newHostname == null) {
    return new Response(
      `Expect hostname in request body`,
      { "status": 400, "statusText": "Bad Request" },
    )
  }
  await APP_MAPPER.put(appName, newHostname);
  return new Response(
    `Updated ${appName} to ${newHostname}`,
    { "status": 200, "statusText": "Ok" },
  )
}