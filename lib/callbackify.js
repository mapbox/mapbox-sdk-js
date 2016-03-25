'use strict';

var interceptor = require('rest/interceptor');

var callbackify = interceptor({
  success: function (response) {
    var request = response && response.request;
    var callback = request && request.callback;

    if (typeof callback === 'function') {
      callback(null, response.entity, response);
    }

    return response;
  },
  error: function (response) {
    var request = response && response.request;
    var callback = request && request.callback;

    if (typeof callback === 'function') {
      var err = response.error || response.entity;
      if (typeof err !== 'object') err = new Error(err);
      callback(err, null, response);
    }

    return response;
  }
});

module.exports = callbackify;
