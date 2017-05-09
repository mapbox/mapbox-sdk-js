/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/tilesets');

test('TilesetClient', function(tilesetClient) {

  tilesetClient.test('#listTilesets', function(listTilesets) {

    listTilesets.test('simple list', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created tileset client');
      client.listTilesets(function(err, tilesets) {
        assert.ifError(err, 'success');
        assert.ok(Array.isArray(tilesets), 'lists tilesets');
        tilesets.forEach(function(tileset) {
          assert.ok(tileset.id, 'Each tileset has an id');
        });
        assert.end();
      });
    });

    // NOTE this test may fail when run in a clean account
    listTilesets.test('paginated list', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created tileset client');
      client.listTilesets({ limit: 1 }, function(err, tilesets, response) {
        assert.ifError(err, 'success');
        assert.equal(tilesets.length, 1);
        assert.equal(typeof response.nextPage, 'function', 'has another page');
        assert.end();
      });
    });

    listTilesets.end();
  });

  tilesetClient.test('#tilequery', function(tilequery) {

    tilequery.test('simple query', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created tileset client');
      client.tilequery('mapbox.mapbox-streets-v7', [0, 0], {}, function(err, results) {
        assert.ifError(err, 'success');
        assert.ok(Array.isArray(results.features), 'lists features');
        assert.ok(results.features.some(function (feature) {
          return feature.properties.tilequery.layer === 'water';
        }));
        assert.end();
      });
    });

    tilequery.end();
  });

  tilesetClient.end();
});
