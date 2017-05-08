'use strict';

// install ES6 Promise polyfill
require('./promise');

var interceptor = require('rest/interceptor');
var linkParser = require('rest/parsers/rfc5988');
var url = require('url');
var querystring = require('querystring');

var paginator = interceptor({
  success: function (response, config) {
    var link = response && response.headers && response.headers.Link;
    var client = response && response.request && response.request.originator;

    if (link) {
      var nextLink = linkParser.parse(link).filter(function (link) {
        return link.rel === 'next';
      })[0];

      if (nextLink) {
        response.nextPage = function (callback) {
          var linkParts = url.parse(nextLink.href);
          var linkQuery = querystring.parse(linkParts.query);
          linkQuery.access_token = linkQuery.access_token || config.access_token;
          linkParts.search = querystring.stringify(linkQuery);
          return client({
            path: url.format(linkParts),
            callback: callback
          });
        };
      }
    }

    return response;
  }
});

module.exports = paginator;
