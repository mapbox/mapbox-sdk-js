/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  // fs = require('fs'),
  // path = require('path'),
  polyline = require('../vendor/polyline'),
  geojsonhint = require('geojsonhint'),
  MapboxClient = require('../lib/services/surface');

test('MapboxClient#surface', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.surface(null);
    });
    t.throws(function() {
      client.surface(1, function() {});
    });
    t.throws(function() {
      client.surface('foo', 1, function() {});
    });
    t.throws(function() {
      client.surface('foo', 1);
    });
    t.end();
  });

  var sample = [
    { longitude: 13.418946862220764, latitude: 52.50055852688439 },
    { longitude: 13.419011235237122, latitude: 52.50113000479732 },
    { longitude: 13.419756889343262, latitude: 52.50171780290061 },
    { longitude: 13.419885635375975, latitude: 52.50237416816131 },
    { longitude: 13.420631289482117, latitude: 52.50294888790448 }
  ];

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.surface('mapbox.mapbox-terrain-v1', 'contour', ['ele'], sample,
      function(err, results) {
        t.ifError(err);
        t.ok(results, 'results are valid');
        t.end();
      });
  });

  t.test('polyline', function(t) {
    var poly = polyline.encode([[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]);
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.surface('mapbox.mapbox-terrain-v1', 'contour', ['ele'], poly, {
      geojson: true,
      interpolate: true
    }, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results.results), [], 'results are valid');
      t.ok(results, 'results are valid');
      t.end();
    });
  });

  t.test('all options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.surface('mapbox.mapbox-terrain-v1', 'contour', ['ele'], sample, {
      geojson: false,
      zoom: 12,
      interpolate: true
    }, function(err, results) {
      t.ifError(err);
      t.ok(results, 'results are valid');
      t.end();
    });
  });

  t.end();
});
