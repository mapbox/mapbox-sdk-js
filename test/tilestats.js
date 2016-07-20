/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/tilestats');
var hat = require('../vendor/hat');
var xtend = require('../vendor/xtend').extend;

var sampleStats = require('./fixtures/tilestats');
var modifiedStats = xtend(sampleStats, { layerCount: 12 });

test('TilestatsClient', function(tilestatsClient) {
  var tilesetid = hat().slice(0, 6);

  tilestatsClient.test('#putTilestats', function(putTilestats) {
    putTilestats.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created tilestats client');
      assert.throws(function() {
        client.putTilestats(null, {}, function() {});
      }, 'tileset must be a string');
      assert.end();
    });

    putTilestats.test('creates with simple tilesetid', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      client.putTilestats(tilesetid, sampleStats, function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, sampleStats, 'expected result');
        assert.end();
      });
    });

    putTilestats.test('creates with tilesetid containing owner', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      client.putTilestats(client.owner + '.' + tilesetid, sampleStats, function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, sampleStats, 'expected result');
        assert.end();
      });
    });

    putTilestats.test('updates', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      client.putTilestats(tilesetid, modifiedStats, function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, modifiedStats, 'expected result');
        assert.end();
      });
    });

    putTilestats.end();
  });

  tilestatsClient.test('#getTilestats', function(getTilestats) {
    getTilestats.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.getTilestats(null, function() {});
      }, 'tileset must be a string');
      assert.end();
    });

    getTilestats.test('get tilestats', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      client.getTilestats(tilesetid, function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, modifiedStats, 'expected result');
        assert.end();
      });
    });

    getTilestats.test('get tilestats when user specified by tilesetid', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      var id = client.owner + '.' + tilesetid;
      client.getTilestats(id, function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, sampleStats, 'expected result');
        assert.end();
      });
    });

    getTilestats.end();
  });

  tilestatsClient.end();
});
