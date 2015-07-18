/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  formatPoints = require('../lib/format_points');

test('formatPoints', function(t) {
  t.throws(function() {
    formatPoints([['foo', 'bar']]);
  });
  t.equal(formatPoints([{latitude: 0, longitude: 0}]), '0,0');
  t.equal(formatPoints([{latitude: 0, longitude: 0}, {latitude: 0, longitude: 10}]), '0,0;10,0');
  t.end();
});
