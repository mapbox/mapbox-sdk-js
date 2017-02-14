/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/matching');

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

  var coordinates = [
    [ 13.418946862220764, 52.50055852688439 ],
    [ 13.419011235237122, 52.50113000479732 ],
    [ 13.419756889343262, 52.50171780290061 ],
    [ 13.419885635375975, 52.50237416816131 ],
    [ 13.420631289482117, 52.50294888790448 ]
  ];

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.matching(coordinates, function(err, results) {
      t.ifError(err);
      t.equals(results.code, 'Ok', 'route returned');
      t.end();
    });
  });

  t.test('all options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.matching(coordinates, {
      profile: 'walking',
      geometry: 'polyline',
      radiuses: [10, 20, 20, 30, 5],
      timestamps: [1480550399960, 1480550399970, 1480550399980, 1480550399990, 1480550400000],
      steps: true,
      annotations: ['duration', 'distance', 'nodes']
    }, function(err, results) {
      t.ifError(err);
      t.ok(results, 'results are valid');
      t.end();
    });
  });

  t.end();
});
