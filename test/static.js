/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/static');

function removeToken(url) {
  return url.replace(/access_token[^&]*&?/, '').replace(/\?$/, '');
}

test('MapboxStatic', function(t) {
  var client = new MapboxClient(process.env.MapboxAccessToken);
  t.throws(function() { client.getStaticURL(); });
  t.throws(function() { client.getStaticURL('foo'); });
  t.throws(function() { client.getStaticURL('foo', 'foo', 10); });

  t.equal(removeToken(client.getStaticURL('user', 'style', 10, 20, {
    longitude: 1, latitude: 2, zoom: 3
  })), 'https://api.mapbox.com/styles/v1/user/style/static/1,2,3/10x20', 'basic url');

  t.equal(removeToken(client.getStaticURL('user', 'style', 10, 20, {
      longitude: 1, latitude: 2, zoom: 3, bearing: 90, pitch: 60
  })), 'https://api.mapbox.com/styles/v1/user/style/static/1,2,3,90,60/10x20', 'bearing and pitch option');

  t.equal(removeToken(client.getStaticURL('user', 'style', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  }, {
    retina: true
  })), 'https://api.mapbox.com/styles/v1/user/style/static/1,2,3/10x10@2x', 'retina option');

  t.equal(removeToken(client.getStaticURL('user', 'style', 10, 10, 'auto', {
    retina: true
  })), 'https://api.mapbox.com/styles/v1/user/style/static/auto/10x10@2x', 'auto');

  t.equal(removeToken(client.getStaticURL('user', 'style', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  }, {
    retina: true,
    markers: [{ longitude: 1, latitude: 2 }]
  })), 'https://api.mapbox.com/styles/v1/user/style/static/pin-l-circle(1,2)/1,2,3/10x10@2x', 'with markers');

  t.equal(removeToken(client.getStaticURL('user', 'style', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  }, {
    retina: true,
    geojson: { type: 'Point', coordinates: [0, 0] }
  })), 'https://api.mapbox.com/styles/v1/user/style/static/geojson(%257B%2522type%2522%253A%2522Point%2522%252C%2522coordinates%2522%253A%255B0%252C0%255D%257D)/1,2,3/10x10@2x', 'with geojson');

  t.equal(removeToken(client.getStaticURL('user', 'style', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  }, {
    retina: true,
    path: { geojson: { type: 'LineString', coordinates: [[0, 0], [1, 1]] } }
  })), 'https://api.mapbox.com/styles/v1/user/style/static/path(??_ibE_ibE)/1,2,3/10x10@2x', 'with path');

  t.equal(removeToken(client.getStaticURL('user', 'style', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  }, {
    retina: true,
    attribution: false,
    logo: false,
    before_layer: 'foo'
  })), 'https://api.mapbox.com/styles/v1/user/style/static/1,2,3/10x10@2x?attribution=false&logo=false&before_layer=foo', 'attribution, logo & before_layer options');

  t.end();
});

test('MapboxStatic classic', function(t) {
  var client = new MapboxClient(process.env.MapboxAccessToken);
  t.throws(function() { client.getStaticClassicURL(); });
  t.throws(function() { client.getStaticClassicURL('foo'); });
  t.throws(function() { client.getStaticClassicURL('foo', 10); });
  t.throws(function() { client.getStaticClassicURL('foo', 'foo', 10); });

  t.equal(removeToken(client.getStaticClassicURL('foo', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  })), 'https://api.mapbox.com/v4/foo/1,2,3/10x10.png', 'basic url');

  t.equal(removeToken(client.getStaticClassicURL('foo', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  }, {
    format: 'jpg80'
  })), 'https://api.mapbox.com/v4/foo/1,2,3/10x10.jpg80', 'format option');

  t.equal(removeToken(client.getStaticClassicURL('foo', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  }, {
    retina: true
  })), 'https://api.mapbox.com/v4/foo/1,2,3/10x10@2x.png', 'retina option');

  t.equal(removeToken(client.getStaticClassicURL('foo', 10, 10, 'auto', {
    retina: true
  })), 'https://api.mapbox.com/v4/foo/auto/10x10@2x.png', 'auto');

  t.equal(removeToken(client.getStaticClassicURL('foo', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  }, {
    retina: true,
    markers: [{ longitude: 1, latitude: 2 }]
  })), 'https://api.mapbox.com/v4/foo/pin-l-circle(1,2)/1,2,3/10x10@2x.png', 'with markers');

  t.equal(removeToken(client.getStaticClassicURL('foo', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  }, {
    retina: true,
    geojson: { type: 'Point', coordinates: [0, 0] }
  })), 'https://api.mapbox.com/v4/foo/geojson(%257B%2522type%2522%253A%2522Point%2522%252C%2522coordinates%2522%253A%255B0%252C0%255D%257D)/1,2,3/10x10@2x.png', 'with geojson');

  t.equal(removeToken(client.getStaticClassicURL('foo', 10, 10, {
    longitude: 1, latitude: 2, zoom: 3
  }, {
    retina: true,
    path: { geojson: { type: 'LineString', coordinates: [[0, 0], [1, 1]] } }
  })), 'https://api.mapbox.com/v4/foo/path(??_ibE_ibE)/1,2,3/10x10@2x.png', 'with path');

  t.end();
});
