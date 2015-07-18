/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  // fs = require('fs'),
  // path = require('path'),
  geojsonhint = require('geojsonhint'),
  MapboxClient = require('../lib/services/matching');

test('MapboxClient#matching', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.matching(null);
    });
    t.throws(function() {
      client.matching(1, function() {});
    });
    t.throws(function() {
      client.matching('foo', 1, function() {});
    });
    t.throws(function() {
      client.matching('foo', 1);
    });
    t.end();
  });

  var sample = {
    'type': 'Feature',
    'properties': {
      'coordTimes': [
        '2015-04-21T06:00:00Z',
        '2015-04-21T06:00:05Z',
        '2015-04-21T06:00:10Z',
        '2015-04-21T06:00:15Z',
        '2015-04-21T06:00:20Z'
      ]
      },
    'geometry': {
      'type': 'LineString',
      'coordinates': [
        [ 13.418946862220764, 52.50055852688439 ],
        [ 13.419011235237122, 52.50113000479732 ],
        [ 13.419756889343262, 52.50171780290061 ],
        [ 13.419885635375975, 52.50237416816131 ],
        [ 13.420631289482117, 52.50294888790448 ]
      ]
    }
  };

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.matching(sample, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('all options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.matching(sample, {
      gps_precision: 8,
      profile: 'mapbox.walking',
      geometry: 'polyline'
    }, function(err, results) {
      t.ifError(err);
      t.ok(results, 'results are valid');
      t.end();
    });
  });

  t.end();
});
