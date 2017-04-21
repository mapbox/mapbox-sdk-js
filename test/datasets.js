/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/datasets');
var geojsonhint = require('geojsonhint').hint;
var geojsonRandom = require('geojson-random');

function randomFeature() {
  return geojsonRandom.polygon(1).features[0];
}

function randomFeatures(count) {
  return geojsonRandom.polygon(count || 1).features;
}

test('DatasetClient', function(datasetClient) {

  if (process.browser) {
    datasetClient.pass('skipping dataset api in browser');
    return datasetClient.end();
  }

  var testDatasets = [];
  var testFeature;

  datasetClient.test('#createDataset', function(createDataset) {
    createDataset.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.createDataset('ham', function() {});
      }, 'options not an object');
      assert.throws(function() {
        client.createDataset();
      }, 'no callback function');
      assert.end();
    });

    createDataset.test('without options', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.createDataset(function(err, dataset) {
        assert.ifError(err, 'success');
        assert.ok(dataset.id, 'has id');
        assert.notOk(dataset.name, 'no name');
        assert.notOk(dataset.description, 'no description');
        assert.equal(dataset.owner, client.owner, 'has owner');
        testDatasets.push(dataset.id);
        assert.end();
      });
    });

    createDataset.test('with options', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.createDataset({
        name: 'test',
        description: 'for testing'
      }, function(err, dataset) {
        assert.ifError(err, 'success');
        assert.ok(dataset.id, 'has id');
        assert.equal(dataset.name, 'test', 'has name');
        assert.equal(dataset.description, 'for testing', 'has description');
        assert.equal(dataset.owner, client.owner, 'has owner');
        testDatasets.push(dataset.id);
        assert.end();
      });
    });

    createDataset.end();
  });

  datasetClient.test('#listDatasets', function(listDatasets) {
    listDatasets.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.end();
    });

    listDatasets.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.listDatasets({fresh:true}, function(err, datasets) {
        assert.ifError(err, 'success');
        assert.ok(Array.isArray(datasets), 'got an array of datasets');
        testDatasets.forEach(function(dataset) {
          var found = datasets.filter(function(ds) {
            return ds.id === dataset;
          })[0];
          assert.ok(found, 'found test dataset ' + dataset);
        });
        assert.end();
      });
    });

    listDatasets.end();
  });

  datasetClient.test('#readDataset', function(readDataset) {
    readDataset.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.readDataset([], function() {});
      }, 'dataset must be a string');
      assert.end();
    });

    readDataset.test('exists', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.readDataset(testDatasets[0], function(err, dataset) {
        assert.ifError(err, 'success');
        assert.equal(dataset.id, testDatasets[0], 'got dataset');
        assert.end();
      });
    });

    readDataset.test('does not exist', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.readDataset('peanuts', function(err /*, response */) {
        assert.equal(err.message, 'No dataset', 'expected message');
        assert.end();
      });
    });

    readDataset.end();
  });

  datasetClient.test('#updateDataset', function(updateDataset) {
    updateDataset.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.updateDataset([], {}, function() {});
      }, 'dataset must be a string');
      assert.throws(function() {
        client.updateDataset('help', 'needs', function() {});
      }, 'dataset must be a string');
      assert.throws(function() {
        client.updateDataset('help', { ham: 'sandwich' }, function() {});
      }, 'must update name or description');
      assert.end();
    });

    updateDataset.test('change the name', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.updateDataset(testDatasets[0], { name: 'changed' }, function(err, dataset) {
        assert.ifError(err, 'success');
        assert.equal(dataset.name, 'changed', 'changed name');
        assert.end();
      });
    });

    updateDataset.test('change the description', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.updateDataset(testDatasets[0], { description: 'changed' }, function(err, dataset) {
        assert.ifError(err, 'success');
        assert.equal(dataset.description, 'changed', 'changed description');
        assert.end();
      });
    });

    updateDataset.end();
  });

  datasetClient.test('#insertFeature', function(insertFeature) {
    insertFeature.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      var validFeature = randomFeature();
      assert.throws(function() {
        client.insertFeature(validFeature, [], function() {});
      }, 'dataset must be a string');
      assert.end();
    });

    insertFeature.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      var validFeature = randomFeature();
      client.insertFeature(validFeature, testDatasets[0], function(err, feature) {
        assert.ifError(err, 'success');
        assert.ok(feature.id, 'feature has an id');
        testFeature = feature.id;
        assert.end();
      });
    });

    insertFeature.end();
  });

  datasetClient.test('#readFeature', function(readFeature) {
    readFeature.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.readFeature({}, '', function() {});
      }, 'id must be a string');
      assert.throws(function() {
        client.readFeature('', [], function() {});
      }, 'dataset must be a string');
      assert.end();
    });

    readFeature.test('exists', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.readFeature(testFeature, testDatasets[0], function(err, feature) {
        assert.ifError(err, 'success');
        assert.equal(feature.id, testFeature, 'got feature');
        assert.end();
      });
    });

    readFeature.test('does not exist', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.readFeature('club', testDatasets[0], function(err /*, response */) {
        assert.equal(err.message, 'Feature does not exist', 'expected error message');
        assert.end();
      });
    });

    readFeature.end();
  });

  datasetClient.test('#deleteFeature', function(deleteFeature) {
    deleteFeature.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.deleteFeature({}, '', function() {});
      }, 'id must be a string');
      assert.throws(function() {
        client.deleteFeature('', [], function() {});
      }, 'dataset must be a string');
      assert.end();
    });

    deleteFeature.test('feature exists', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.deleteFeature(testFeature, testDatasets[0], function(err, response) {
        assert.ifError(err, 'success');
        assert.deepEqual(response, '', 'empty response');
        assert.end();
      });
    });

    deleteFeature.test('feature does not exist', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.deleteFeature('blt', testDatasets[0], function(err /*, response */) {
        assert.equal(err.message, 'Feature does not exist', 'expected error message');
        assert.end();
      });
    });

    deleteFeature.end();
  });

  datasetClient.test('#listFeatures', function(listFeatures) {
    listFeatures.test('insert some', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      var features = randomFeatures(3).map(function(f, i) {
        f.id = 'feature-' + i;
        return f;
      });
      client.insertFeature(features[0], testDatasets[1], function(err) {
        assert.ifError(err, 'first feature added');
        if (err) return assert.end();
        client.insertFeature(features[1], testDatasets[1], function(err) {
          assert.ifError(err, 'second feature added');
          if (err) return assert.end();
          client.insertFeature(features[2], testDatasets[1], function(err) {
             assert.ifError(err, 'second feature added');
             assert.end();
          });
        });
      });
    });

    listFeatures.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.listFeatures([], function() {});
      }, 'dataset must be a string');
      assert.throws(function() {
        client.listFeatures([], '', function() {});
      }, 'options must be a object');
      assert.throws(function() {
        client.listFeatures([], {
          limit: ''
        }, function() {});
      }, 'limit option must be a number');
      assert.end();
    });

    listFeatures.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.listFeatures(testDatasets[1], function(err, collection) {
        assert.ifError(err, 'success');
        assert.equal(geojsonhint(collection).length, 0, 'receieved valid GeoJSON');
        assert.equal(collection.features.length, 3, 'returned three features');
        assert.end();
      });
    });

    listFeatures.test('options.limit', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      client.listFeatures(testDatasets[1], {
        limit: 1
      }, function(err, collection) {
        assert.ifError(err, 'success');
        assert.equal(collection.features.length, 1, 'returned one feature');
        assert.end();
      });
    });

    listFeatures.end();
  });

  datasetClient.test('#deleteDataset', function(deleteDataset) {
    deleteDataset.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created dataset client');
      assert.throws(function() {
        client.deleteDataset([], function() {});
      }, 'dataset must be a string');
      assert.end();
    });

    testDatasets.forEach(function(datasetId) {
      deleteDataset.test('#deleteDataset ' + datasetId, function(assert) {
        var client = new MapboxClient(process.env.MapboxAccessToken);
        assert.ok(client, 'created dataset client');
        client.deleteDataset(datasetId, function(err) {
          assert.ifError(err, 'success');
          assert.end();
        });
      });
    });

    deleteDataset.end();
  });

  datasetClient.end();
});
