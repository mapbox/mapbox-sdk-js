'use strict';

var invariant = require('invariant');
var constants = require('./constants');
var getUser = require('./get_user');

function makeService(name) {

  function service(accessToken, options) {
    this.name = name;

    invariant(typeof accessToken === 'string',
      'accessToken required to instantiate Mapbox client');

    this.user = getUser(accessToken);
    invariant(!!this.user, 'could not determine user from provided accessToken');

    this.accessToken = accessToken;
    this.endpoint = constants.DEFAULT_ENDPOINT;

    if (options !== undefined) {
      invariant(typeof options === 'object', 'options must be an object');
      if (options.endpoint) {
        invariant(typeof options.endpoint === 'string', 'endpoint must be a string');
        this.endpoint = options.endpoint;
      }
    }
  }

  return service;
}

module.exports = makeService;
