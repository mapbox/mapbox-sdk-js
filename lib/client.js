'use strict';

var rest = require('rest');
var callbackify = require('./callbackify');
var interceptor = require('rest/interceptor');

// rest.js client with MIME support
module.exports = function(config) {
  return rest
    .wrap(require('rest/interceptor/errorCode'))
    .wrap(require('rest/interceptor/pathPrefix'), { prefix: config.endpoint })
    .wrap(require('rest/interceptor/mime'), { mime: 'application/json' })
    .wrap(require('rest/interceptor/defaultRequest'), {
      params: { access_token: config.accessToken }
    })
    .wrap(interceptor({ request: function(request, config) {
        // if there are any explicitly-marked get parameters, stick them in 'params' now that interpolation is done
        if (request.getParams) request.params = request.getParams;
        return request;
     }}))
    .wrap(require('rest/interceptor/template'))
    .wrap(callbackify);
};
