/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  // fs = require('fs'),
  // path = require('path'),
  geojsonhint = require('geojsonhint'),
  MapboxClient = require('../lib/services/geocoder');

test('MapboxClient#geocodeForward', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.geocodeForward(null);
    }, /query/);
    t.throws(function() {
      client.geocodeForward(1, function() {});
    }, /query/);
    t.throws(function() {
      client.geocodeForward('foo', 1, function() {});
    }, /options/);
    t.throws(function() {
      client.geocodeForward('foo', {});
    }, /callback/);
    t.end();
  });

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward('Chester, New Jersey', function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('dataset option', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward(
      'Chester, New Jersey', { dataset: 'mapbox.places' },
      function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.equal(geojsonhint.hint(results.features[0]).length, 0, 'at least one valid result');
      t.end();
    });
  });

  t.test('options.proximity', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward('Paris', {
      proximity: { latitude: 33.6875431, longitude: -95.4431142 }
    }, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.end();
});

test('MapboxClient#geocodeReverse', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.geocodeReverse();
    }, /location/);
    t.throws(function() {
      client.geocodeReverse(1, function() {});
    }, /location/);
    t.throws(function() {
      client.geocodeReverse({}, 1, function() {});
    }, /options/);
    t.throws(function() {
      client.geocodeReverse({}, {});
    }, /callback/);
    t.end();
  });

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeReverse({ latitude: 33.6875431, longitude: -95.4431142 }, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('dataset option', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeReverse(
      { latitude: 33.6875431, longitude: -95.4431142 },
      { dataset: 'mapbox.places' },
      function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.end();
});
