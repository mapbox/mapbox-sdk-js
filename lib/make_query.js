'use strict';

var qs = require('querystring');

function makeQuery(accessToken, options) {
  options.access_token = accessToken;
  return '?' + qs.stringify(options);
}

module.exports = makeQuery;
