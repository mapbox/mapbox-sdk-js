var interceptor = require('rest/interceptor');

var standardResponse = interceptor({
  response: transform,
});

function transform(response) {
  return {
    url: response.url,
    status: response.status && response.status.code,
    headers: response.headers,
    entity: response.entity,
    error: response.error,
    callback: response.request && response.request.callback,
    nextPage: response.nextPage
  };
}

module.exports = standardResponse;
