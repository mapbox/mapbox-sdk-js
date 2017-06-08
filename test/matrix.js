/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  MapboxClient = require('../lib/services/matrix');

test('MapboxClient#getMatrix', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.getMatrix(null);
    });
    t.throws(function() {
      client.getMatrix(1, function() {});
    });
    t.throws(function() {
      client.getMatrix('foo', 1, function() {});
    });
    t.throws(function() {
      client.getMatrix('foo', 1);
    });
    t.end();
  });

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.getMatrix([{ 
      longitude: -122.42,
      latitude: 37.78
    },
    { 
      longitude: -122.45,
      latitude: 37.91
    },
    { 
      longitude: -122.48,
      latitude: 37.73
    }],{ profile: 'walking'}, function(err, results) {
      t.ifError(err);
      t.ok(Array.isArray(results.durations), 'returns an array');
      t.equal(results.durations.length, 3, 'array has correct dimension');
      t.equal(results.durations[0].length, 3, 'array has correct dimension');
      t.end();
    });
  });

  // t.test('profile option', function(t) {
  //   var client = new MapboxClient(process.env.MapboxAccessToken);
  //   t.ok(client);
  //   client.getMatrix([
  //     [-95.4431142, 33.6875431],
  //     [-95.4831142, 33.6875431],
  //     [-95.4831142, 33.2875431],
  //     [-95.4831142, 33.3875431],
  //     [-95.4831142, 33.0875431]
  //   ], {
  //     profile: 'walking'
  //   }, function(err, results) {
  //     t.ifError(err);
  //     t.ok(Array.isArray(results.durations), 'returns an array');
  //     t.equal(results.durations.length, 5, 'array has correct dimension');
  //     t.equal(results.durations[0].length, 5, 'array has correct dimension');
  //     t.end();
  //   });
  // });

  t.end();
});


