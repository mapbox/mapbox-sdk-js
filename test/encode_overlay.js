/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  encodeOverlay = require('../lib/encode_overlay');

test('encodeGeoJSON', function(t) {
  t.equal(encodeOverlay.encodeGeoJSON({
    type: 'Point',
    coordinates: [0, 0]
  }), 'geojson(%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B0%2C0%5D%7D)');
  t.end();
});

test('encodePath', function(t) {
  t.equal(encodeOverlay.encodePath({
    geojson: { type: 'LineString', coordinates: [[0, 0], [1, 1]] }
  }), 'path(??_ibE_ibE)');
  t.equal(encodeOverlay.encodePath({
    geojson: { type: 'LineString', coordinates: [[0, 0], [1, 1]] },
    style: { strokecolor: 'fee' }
  }), 'path+fee(??_ibE_ibE)');
  t.equal(encodeOverlay.encodePath({
    geojson: { type: 'LineString', coordinates: [[0, 0], [1, 1]] },
    style: { strokewidth: 10, strokecolor: 'fee' }
  }), 'path-10+fee(??_ibE_ibE)');
  t.end();
});

test('encodeMarkers', function(t) {
  t.equal(encodeOverlay.encodeMarkers([]), '');
  t.equal(encodeOverlay.encodeMarkers([{
    longitude: 0, latitude: 0
  }]), 'pin-l-circle(0,0)');
  t.equal(encodeOverlay.encodeMarkers([{
    longitude: 0, latitude: 0, size: 'm'
  }]), 'pin-m-circle(0,0)');
  t.equal(encodeOverlay.encodeMarkers([{
    longitude: 0, latitude: 0, symbol: 'city'
  }]), 'pin-l-city(0,0)');
  t.equal(encodeOverlay.encodeMarkers([{
    longitude: 0, latitude: 0, symbol: 'city'
  }, {
    longitude: 10, latitude: 2, symbol: 'circle'
  }]), 'pin-l-city(0,0),pin-l-circle(10,2)');
  t.end();
});
