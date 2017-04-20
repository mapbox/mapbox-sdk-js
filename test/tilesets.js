/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/tilesets');

test('TilesetClient', function(tilesetClient) {

  if (process.browser) {
    tilesetClient.pass('skipping tileset api in browser');
    return tilesetClient.end();
  }


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

    listTilesets.end();
  });

  tilesetClient.end();
});
