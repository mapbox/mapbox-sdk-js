var interceptor = require('rest/interceptor');

var standardResponse = interceptor({
  response: transform,
});

function transform(response) {
  var status = undefined;
  if (response.status) {
    status = response.status.code;
  }
  return {
    url: response.url,
    status: status,
    headers: response.headers,
    entity: response.entity,
    error: response.error,
    callback: response.request.callback
  };
}

module.exports = standardResponse;
