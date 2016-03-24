/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/tilestats');
var hat = require('../vendor/hat');

test('TilestatsClient', function(tilestatsClient) {
  var tilesetid = hat().slice(0, 6);

  tilestatsClient.test('#createTilestats', function(createTilestats) {
    createTilestats.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.createTilestats(null, ['ham'], function() {});
      }, 'tileset must be a string');
      assert.throws(function() {
        client.createTilestats('yes', 'ham', function() {});
      }, 'layers must be an array');
      assert.throws(function() {
        client.createTilestats('yes', [{}], function() {});
      }, 'layers must be an array of strings');
      assert.end();
    });

    createTilestats.test('creates', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      client.createTilestats(tilesetid, ['layer'], function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: tilesetid,
          layers: [
            {
              account: client.owner,
              tilesetid: tilesetid,
              layer: 'layer',
              geometry: 'UNKNOWN',
              count: 0,
              attributes: []
            }
          ]
        }, 'expected result');
        assert.end();
      });
    });

    createTilestats.test('creates - promise style', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      client.createTilestats(tilesetid, ['layer']).then(function(result) {
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: tilesetid,
          layers: [
            {
              account: client.owner,
              tilesetid: tilesetid,
              layer: 'layer',
              geometry: 'UNKNOWN',
              count: 0,
              attributes: []
            }
          ]
        }, 'expected result');
        assert.end();
      });
    });

    createTilestats.test('creates when user specified by tilesetid', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      var id = client.owner + '.' + tilesetid;
      client.createTilestats(id, ['layer'], function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: id,
          layers: [
            {
              account: client.owner,
              tilesetid: id,
              layer: 'layer',
              geometry: 'UNKNOWN',
              count: 0,
              attributes: []
            }
          ]
        }, 'expected result');
        assert.end();
      });
    });

    createTilestats.end();
  });

  tilestatsClient.test('#updateTilestatsLayer', function(updateTilestatsLayer) {
    updateTilestatsLayer.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.updateTilestatsLayer(null, 'ham', {}, function() {});
      }, 'tileset must be a string');
      assert.throws(function() {
        client.updateTilestatsLayer('yes', null, {}, function() {});
      }, 'layer must be a string');
      assert.throws(function() {
        client.updateTilestatsLayer('yes', 'ham', 'geom', function() {});
      }, 'geometries must be an object');
      assert.end();
    });

    updateTilestatsLayer.test('updates layer', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      var geoms = { 'point': 10, 'linestring': 100 };
      client.updateTilestatsLayer(tilesetid, 'layer', geoms, function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: tilesetid,
          layer: 'layer',
          geometry: 'LineString',
          count: 110,
          attributes: []
        }, 'expected result');
        assert.end();
      });
    });

    updateTilestatsLayer.test('updates layer when user specified by tilesetid', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      var geoms = { 'point': 10, 'linestring': 100 };
      var id = client.owner + '.' + tilesetid;
      client.updateTilestatsLayer(id, 'layer', geoms, function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: id,
          layer: 'layer',
          geometry: 'LineString',
          count: 110,
          attributes: []
        }, 'expected result');
        assert.end();
      });
    });

    updateTilestatsLayer.end();
  });

  tilestatsClient.test('#updateTilestatsAttribute', function(updateTilestatsAttribute) {
    updateTilestatsAttribute.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.updateTilestatsAttribute(null, 'ham', 'eggs', {}, function() {});
      }, 'tileset must be a string');
      assert.throws(function() {
        client.updateTilestatsAttribute('yes', null, 'eggs', {}, function() {});
      }, 'layer must be a string');
      assert.throws(function() {
        client.updateTilestatsAttribute('yes', 'ham', null, {}, function() {});
      }, 'attribute must be a string');
      assert.throws(function() {
        client.updateTilestatsAttribute('yes', 'ham', 'eggs', 'stats', function() {});
      }, 'stats must be an object');
      assert.end();
    });

    updateTilestatsAttribute.test('update attribute', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      var stats = { min: 2, max: 2, values: [2] };
      client.updateTilestatsAttribute(tilesetid, 'layer', 'attr', stats, function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: tilesetid,
          layer: 'layer',
          attribute: 'attr',
          type: 'number',
          min: 2,
          max: 2,
          values: [2]
        }, 'expected result');
        assert.end();
      });
    });

    updateTilestatsAttribute.test('update attribute when user specified by tilesetid', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      var stats = { min: 2, max: 2, values: [2] };
      var id = client.owner + '.' + tilesetid;
      client.updateTilestatsAttribute(id, 'layer', 'attr', stats, function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: id,
          layer: 'layer',
          attribute: 'attr',
          type: 'number',
          min: 2,
          max: 2,
          values: [2]
        }, 'expected result');
        assert.end();
      });
    });

    updateTilestatsAttribute.end();
  });

  tilestatsClient.test('#getTilestatsAttribute', function(getTilestatsAttribute) {
    getTilestatsAttribute.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.getTilestatsAttribute(null, 'ham', 'eggs', function() {});
      }, 'tileset must be a string');
      assert.throws(function() {
        client.getTilestatsAttribute('yes', null, 'eggs', function() {});
      }, 'layer must be a string');
      assert.throws(function() {
        client.getTilestatsAttribute('yes', 'ham', null, function() {});
      }, 'attribute must be a string');
      assert.end();
    });

    getTilestatsAttribute.test('get attribute', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      client.getTilestatsAttribute(tilesetid, 'layer', 'attr', function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: tilesetid,
          layer: 'layer',
          attribute: 'attr',
          type: 'number',
          min: 2,
          max: 2,
          values: [2]
        }, 'expected result');
        assert.end();
      });
    });

    getTilestatsAttribute.test('get attribute when user specified by tilesetid', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      var id = client.owner + '.' + tilesetid;
      client.getTilestatsAttribute(id, 'layer', 'attr', function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: id,
          layer: 'layer',
          attribute: 'attr',
          type: 'number',
          min: 2,
          max: 2,
          values: [2]
        }, 'expected result');
        assert.end();
      });
    });

    getTilestatsAttribute.end();
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
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: tilesetid,
          layers: [
            {
              account: client.owner,
              tilesetid: tilesetid,
              layer: 'layer',
              geometry: 'LineString',
              count: 110,
              attributes: [
                {
                  attribute: 'attr',
                  min: 2,
                  max: 2,
                  values: [2]
                }
              ]
            }
          ]
        }, 'expected result');
        assert.end();
      });
    });

    getTilestats.test('get tilestats when user specified by tilesetid', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      var id = client.owner + '.' + tilesetid;
      client.getTilestats(id, function(err, result) {
        assert.ifError(err, 'success');
        assert.deepEqual(result, {
          account: client.owner,
          tilesetid: id,
          layers: [
            {
              account: client.owner,
              tilesetid: id,
              layer: 'layer',
              geometry: 'LineString',
              count: 110,
              attributes: [
                {
                  attribute: 'attr',
                  min: 2,
                  max: 2,
                  values: [2]
                }
              ]
            }
          ]
        }, 'expected result');
        assert.end();
      });
    });

    getTilestats.end();
  });

  tilestatsClient.test('#deleteTilestats', function(deleteTilestats) {
    deleteTilestats.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.deleteTilestats(null, function() {});
      }, 'tileset must be a string');
      assert.end();
    });

    deleteTilestats.test('deletes', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      client.deleteTilestats(tilesetid, function(err, result) {
        assert.ifError(err, 'success');
        assert.notOk(result, 'no result');
        assert.end();
      });
    });

    deleteTilestats.test('deletes when user specified by tilesetid', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      var id = client.owner + '.' + tilesetid;
      client.deleteTilestats(id, function(err, result) {
        assert.ifError(err, 'success');
        assert.notOk(result, 'no result');
        assert.end();
      });
    });

    deleteTilestats.end();
  });

  tilestatsClient.end();
});
