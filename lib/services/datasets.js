'use strict';

var invariant = require('invariant'),
  geojsonhint = require('geojsonhint/object'),
  request = require('superagent'),
  hat = require('hat'),
  makeService = require('../make_service'),
  constants = require('../constants'),
  makeURL = require('../make_url');

var Datasets = module.exports = makeService('MapboxDatasets');

Datasets.prototype.listDatasets = function(callback) {
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.DATASETS, { user: this.user });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

Datasets.prototype.createDataset = function(options, callback) {
  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  invariant(typeof options === 'object', 'options must be an object');
  invariant(typeof callback === 'function', 'callback must be a function');

  if (options.name) invariant(typeof options.name === 'string', 'options.name must be a string');
  if (options.description) invariant(typeof options.description === 'string', 'options.description must be a string');

  var url = makeURL(this, constants.DATASETS, { user: this.user });

  request
    .post(url)
    .send(options)
    .end(function(err, res) {
      callback(err, res.body);
    });
};

Datasets.prototype.readDataset = function(dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.DATASET, {
    user: this.user,
    dataset: dataset
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

Datasets.prototype.updateDataset = function(dataset, options, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');
  invariant(typeof options === 'object', 'options must be an object');
  invariant(!!options.name || !!options.description, 'options must include a name or a description');

  if (options.name) invariant(typeof options.name === 'string', 'options.name must be a string');
  if (options.description) invariant(typeof options.description === 'string', 'options.description must be a string');

  var url = makeURL(this, constants.DATASET, {
    user: this.user,
    dataset: dataset
  });

  request
    .patch(url)
    .send(options)
    .end(function(err, res) {
      callback(err, res.body);
    });
};

Datasets.prototype.deleteDataset = function(dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.DATASET, {
    user: this.user,
    dataset: dataset
  });

  request
    .del(url)
    .end(function(err) {
      callback(err);
    });
};

Datasets.prototype.listFeatures = function(dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.FEATURES, {
    user: this.user,
    dataset: dataset
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

Datasets.prototype.insertFeature = function(feature, dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');
  invariant(geojsonhint.hint(feature).length === 0, 'feature must be valid GeoJSON');

  var id = feature.id || hat();
  invariant(typeof id === 'string', 'The GeoJSON feature\'s id must be a string');

  var url = makeURL(this, constants.FEATURE, {
    user: this.user,
    dataset: dataset,
    id: id
  });

  request
    .put(url)
    .send(feature)
    .end(function(err, res) {
      callback(err, res.body);
    });
};

Datasets.prototype.readFeature = function(id, dataset, callback) {
  invariant(typeof id === 'string', 'id must be a string');
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.FEATURE, {
    user: this.user,
    dataset: dataset,
    id: id
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

Datasets.prototype.deleteFeature = function(id, dataset, callback) {
  invariant(typeof id === 'string', 'id must be a string');
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.FEATURE, {
    user: this.user,
    dataset: dataset,
    id: id
  });

  request
    .del(url)
    .end(function(err, res) {
      callback(err, res.body);
    });
};

Datasets.prototype.bulkFeatureUpdate = function(inserts, deletes, dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  inserts = inserts || [];
  invariant(
    geojsonhint.hint({type: 'FeatureCollection', features: inserts}).length === 0,
    'inserts must be an array of valid GeoJSON features'
  );
  invariant(
    inserts.every(function(feature) { return feature.id; }),
    'inserted GeoJSON features must include ids'
  );

  deletes = deletes || [];
  invariant(
    deletes.every(function(id) { return typeof id === 'string'; }),
    'deletes must be an array of strings'
  );

  var url = makeURL(this, constants.FEATURES, {
    user: this.user,
    dataset: dataset
  });

  request
    .post(url)
    .send({ put: inserts, delete: deletes })
    .end(function(err, res) {
      callback(err, res.body);
    });
};
