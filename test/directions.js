/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  // fs = require('fs'),
  // path = require('path'),
  geojsonhint = require('geojsonhint'),
  MapboxClient = require('../lib/services/directions');

test('MapboxClient#getDirections', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.getDirections(null);
    });
    t.throws(function() {
      client.getDirections(1, function() {});
    });
    t.throws(function() {
      client.getDirections('foo', 1, function() {});
    });
    t.throws(function() {
      client.getDirections('foo', 1);
    });
    t.end();
  });

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.getDirections([
      { latitude: 33.6875431, longitude: -95.4431142 },
      { latitude: 33.6875431, longitude: -95.4831142 }
    ], function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results.origin), [], 'origin is valid');
      t.end();
    });
  });

  t.test('promise interface', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.getDirections([
      { latitude: 33.6875431, longitude: -95.4431142 },
      { latitude: 33.6875431, longitude: -95.4831142 }
    ]).then(function(results) {
      t.deepEqual(geojsonhint.hint(results.origin), [], 'origin is valid');
      t.end();
    }, function(err) {
      t.ifError(err);
    });
  });

  t.test('assert options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);

    var tester = { client: function(opts) {
      var params = opts.params;
      t.equals(params.profile, 'mapbox.walking', 'profile as walking is set');
      t.equals(params.geometry, 'polyline', 'geometry as polyline is set');
      t.equals(params.instructions, 'html', 'instructions as HTML is set');

      t.notOk(params.alternatives, 'alternatives option is set to false');
      t.notOk(params.steps, 'steps option is set to false');
      opts.callback();
      return { entity: function() {} };
    }};

    client.getDirections.apply(tester, [[
      { latitude: 33.6875431, longitude: -95.4431142 },
      { latitude: 33.6875431, longitude: -95.4831142 }
    ], {
      profile: 'mapbox.walking',
      alternatives: false,
      steps: false,
      geometry: 'polyline',
      instructions: 'html'
    }, function(err) {
      t.ifError(err);
      t.end();
    }]);
  });

  t.test('all options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);

    client.getDirections([
      { latitude: 33.6875431, longitude: -95.4431142 },
      { latitude: 33.6875431, longitude: -95.4831142 }
    ], {
      profile: 'mapbox.walking',
      alternatives: false,
      steps: false,
      geometry: 'polyline',
      instructions: 'html'
    }, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results.origin), [], 'origin is valid');
      t.end();
    });
  });

  t.end();
});
