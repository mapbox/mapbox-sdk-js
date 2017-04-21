/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/datasets');

test('PaginatorClient', function(paginatorClient) {

  var testItems = [];

  paginatorClient.test('setup datasets', function(setup) {
    for (var i=0; i< 3; i++) {
      setup.test('create dataset', function(assert) {
        var client = new MapboxClient(process.env.MapboxAccessToken);
        assert.ok(client, 'created dataset client');
        client.createDataset(function(err, dataset) {
          assert.ifError(err, 'success');
          testItems.push(dataset.id);
          assert.end();
        });
      });
    }

    setup.end();
  });

  paginatorClient.test('listing', function(listing) {

    listing.test('without pagination', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.listDatasets(function(err, list, res) {
        assert.ifError(err, 'success');
        assert.ok(list.length >= 3, 'full list');
        assert.notOk(res.nextPage, 'no more pages');
        assert.end();
      });
    });

    listing.test('with pagination', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.listDatasets({ limit: 1, sortby: 'created', fresh: true }, function(err, list, res) {
        assert.ifError(err, 'success');
        assert.equal(list.length, 1, 'partial list');
        assert.ok(res.nextPage, 'more pages');

        res.nextPage(function(err, list, res) {
          assert.ifError(err, 'success');
          assert.equal(list.length, 1, 'partial list');
          assert.ok(res.nextPage, 'more pages');

          assert.end();
        });
      });
    });

    listing.end();
  });

  paginatorClient.test('cleanup datasets', function(cleanup) {
    while (testItems.length) {
      var item = testItems.pop();

      cleanup.test('cleanup dataset ' + item, function(assert) {
        var client = new MapboxClient(process.env.MapboxAccessToken);
        assert.ok(client, 'created dataset client');
        client.deleteDataset(item, function() {
          // TODO figure out why the delete fails sometimes
          // assert.ifError(err, 'success');
          assert.end();
        });
      });
    }

    cleanup.end();
  });

  paginatorClient.end();
});
