!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t){addEventListener("fetch",e=>{e.respondWith(async function(e){var t=new URL(e.url);const n=t.hostname,r=await APP_MAPPER.get("updateMappingSubdomain"),o=n.split(".")[0];if(o==r)return async function(e,t){const n=await e.json();if(await APP_MAPPER.get("updateMappingSecret")!=n.token)return new Response("Token mismatch",{status:401,statusText:"Unauthorized"});const r=n.appName;if(null==r)return new Response("Expect appName in request body",{status:400,statusText:"Bad Request"});const o=n.hostname;if(null==o)return new Response("Expect hostname in request body",{status:400,statusText:"Bad Request"});return await APP_MAPPER.put(r,o),new Response(`Updated ${r} to ${o}`,{status:200,statusText:"Ok"})}(e);var a=await APP_MAPPER.get(o);if(null==a)return new Response("No app "+o,{status:404,statusText:"Not Found"});var u=new URL(a+t.pathname);const s=new Request(u,{method:e.method,headers:e.headers});return await fetch(s).then(e=>e).catch(e=>(console.log(e),new Response("Failed to proxy to app "+o,{status:500,statusText:"Internal Server Error"})))}(e.request))})}]);