/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/directions');

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
      t.equals(results.code, 'Ok', 'route returned');
      t.end();
    });
  });

  t.test('promise interface', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.getDirections([
      { latitude: 33.6875431, longitude: -95.4431142 },
      { latitude: 33.6875431, longitude: -95.4831142 }
    ]).then(function(res) {
      var results = res.entity;
      t.equals(results.code, 'Ok', 'route returned');
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

      t.equals(params.profile, 'walking', 'profile as walking is set');
      t.equals(params.geometries, 'polyline', 'geometries as polyline is set');
      t.equals(params.radiuses, '2000;2000', 'radiuses option is set');
      t.equals(params.bearings, '45,90;45,90', 'bearings option is set');

      t.notOk(params.alternatives, 'alternatives option is set to false');
      t.notOk(params.steps, 'steps option is set to false');
      opts.callback();
      return { entity: function() {} };
    }};

    client.getDirections.apply(tester, [[
      { latitude: 33.6875431, longitude: -95.4431142 },
      { latitude: 33.6875431, longitude: -95.4831142 }
    ], {
      profile: 'walking',
      alternatives: false,
      radiuses: [2000, 2000],
      bearings: [[45, 90], [45, 90]],
      steps: false,
      geometries: 'polyline'
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
      profile: 'walking',
      alternatives: false,
      geometries: 'polyline',
      overview: 'full',
      radiuses: [2000, 2000],
      steps: false,
      continue_straight: false,
      bearings: [[45, 90], [45, 90]]
    }, function(err, results) {
      t.ifError(err);
      t.equals(results.code, 'Ok', 'route returned');
      t.end();
    });
  });

  t.end();
});
