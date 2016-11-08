'use strict';

if (typeof Promise === 'undefined') {
  // install ES6 Promise polyfill
  require('../vendor/promise');
}

var rest = require('rest');
var standardResponse = require('./standard_response');
var callbackify = require('./callbackify');

// rest.js client with MIME support
module.exports = function(config) {
  return rest
    .wrap(require('rest/interceptor/errorCode'))
    .wrap(require('rest/interceptor/pathPrefix'), { prefix: config.endpoint })
    .wrap(require('rest/interceptor/mime'), { mime: 'application/json' })
    .wrap(require('rest/interceptor/params'))
    .wrap(require('rest/interceptor/defaultRequest'), {
      params: { access_token: config.accessToken }
    })
    .wrap(require('rest/interceptor/template'))
    .wrap(standardResponse)
    .wrap(callbackify);
};
