/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  makeQuery = require('../lib/make_query');

test('makeQuery', function(t) {
  t.equal(makeQuery('test', {}), '?access_token=test');
  t.equal(makeQuery('test', {foo: 1}), '?foo=1&access_token=test');
  t.end();
});
