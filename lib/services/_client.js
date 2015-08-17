'use strict';

var rest = require('rest');
var interceptor = require('rest/interceptor');

var callbackify = interceptor({
  success: function (response) {
    var request = response && response.request;
    var callback = request && request.callback;

    if (typeof callback === 'function') {
      callback(null, response.entity);
    }

    return response;
  },
  error: function (response) {
    var request = response && response.request;
    var callback = request && request.callback;

    if (typeof callback === 'function') {
      callback(response.error || response.entity);
    }

    return response;
  }
});

// rest.js client with MIME support
module.exports = rest
  .wrap(require('rest/interceptor/errorCode'))
  .wrap(require('rest/interceptor/mime'), { mime: 'application/json' })
  .wrap(callbackify);
