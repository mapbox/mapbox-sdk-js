'use strict';

var test = require('tap').test,
  MapboxClient = require('../');

test('prerequisites', function(t) {
  t.ok(process.env.MapboxAccessToken, 'mapbox access token is provided');
  t.end();
});

test('MapboxClient', function(t) {
  t.throws(function() {
    var client = new MapboxClient();
    t.notOk(client);
  });
  var client = new MapboxClient('token');
  t.ok(client);
  t.equal(client.accessToken, 'token');
  t.end();
});

test('MapboxClient#geocode', function(t) {
  var client = new MapboxClient(process.env.MapboxAccessToken);
  t.ok(client);
  t.end();
});
