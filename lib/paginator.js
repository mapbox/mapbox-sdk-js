'use strict';

// install ES6 Promise polyfill
require('./promise');

var interceptor = require('rest/interceptor');
var linkParser = require('rest/parsers/rfc5988');

var paginator = interceptor({
  success: function (response) {
    var link = response && response.headers && response.headers.Link;
    var client = response && response.request && response.request.originator;

    if (link) {
      var nextLink = linkParser.parse(link).filter(function (link) {
        return link.rel === 'next';
      })[0];

      if (nextLink) {
        response.nextPage = function (callback) {
          return client({
            path: nextLink.href,
            callback: callback
          });
        };
      }
    }

    return response;
  }
});

module.exports = paginator;
