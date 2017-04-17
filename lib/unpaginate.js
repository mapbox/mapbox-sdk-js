'use strict';

// install ES6 Promise polyfill
require('./promise');

var interceptor = require('rest/interceptor');

var parseLinkHeader = require('parse-link-header');

var unpaginate = interceptor({
  response: function (response, config, meta) {
    if (response.headers.Link) {
      return meta.client({ path: parseLinkHeader(response.headers.Link).next.url}).then(function (nextPageResponse) {
          if (nextPageResponse && nextPageResponse.entity) {
              response.entity = response.entity.concat(nextPageResponse.entity);
          }
          return response;
      });
    } else {
        return response;
    }
  },
  error: function (response) {
    return response;
  }
});

module.exports = unpaginate;
