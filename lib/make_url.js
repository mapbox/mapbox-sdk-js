'use strict';

var xtend = require('xtend'),
  qs = require('querystring'),
  resolveToString = require('es6-template-strings/resolve-to-string');

function makeURL(self, template, params, query) {
  return resolveToString(template,
    xtend(params, {
      endpoint: self.endpoint,
      query: qs.stringify(xtend(query, { access_token: self.accessToken }))
    }));
}

module.exports = makeURL;
