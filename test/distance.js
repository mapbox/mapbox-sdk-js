/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  MapboxClient = require('../lib/services/distance');

test('MapboxClient#getDistances', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.getDistances(null);
    });
    t.throws(function() {
      client.getDistances(1, function() {});
    });
    t.throws(function() {
      client.getDistances('foo', 1, function() {});
    });
    t.throws(function() {
      client.getDistances('foo', 1);
    });
    t.end();
  });

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.getDistances([
      [-95.4431142, 33.6875431],
      [-95.4831142, 33.6875431],
      [-95.4831142, 33.2875431],
      [-95.4831142, 33.3875431],
      [-95.4831142, 33.0875431]
    ], function(err, results) {
      t.ifError(err);
      t.ok(Array.isArray(results.durations), 'returns an array');
      t.equal(results.durations.length, 5, 'array has correct dimension');
      t.equal(results.durations[0].length, 5, 'array has correct dimension');
      t.end();
    });
  });

  t.test('profile option', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.getDistances([
      [-95.4431142, 33.6875431],
      [-95.4831142, 33.6875431],
      [-95.4831142, 33.2875431],
      [-95.4831142, 33.3875431],
      [-95.4831142, 33.0875431]
    ], {
      profile: 'walking'
    }, function(err, results) {
      t.ifError(err);
      t.ok(Array.isArray(results.durations), 'returns an array');
      t.equal(results.durations.length, 5, 'array has correct dimension');
      t.equal(results.durations[0].length, 5, 'array has correct dimension');
      t.end();
    });
  });

  t.test('a null route', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.getDistances([
      [-95.4431142, 33.6875431],
      [-95.4831142, 33.6875431],
      [-95.4831142, 33.2875431],
      [0, 0],
      [-95.4831142, 33.0875431]
    ], {
      profile: 'walking'
    }, function(err, results) {
      t.ifError(err);
      t.ok(Array.isArray(results.durations), 'returns an array');
      t.equal(results.durations.length, 5, 'array has correct dimension');
      t.equal(results.durations[0].length, 5, 'array has correct dimension');
      t.end();
    });
  });

  t.end();
});
