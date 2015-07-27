'use strict';

var invariant = require('invariant'),
  geojsonhint = require('geojsonhint/object'),
  request = require('superagent'),
  hat = require('hat'),
  makeService = require('../make_service'),
  constants = require('../constants'),
  makeURL = require('../make_url');

var Datasets = module.exports = makeService('MapboxDatasets');

/**
 * To retrieve a listing of datasets for a particular account.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {Function} callback called with (err, datasets)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.listDatasets(function(err, datasets) {
 *   console.log(datasets);
 *   // [
 *   //   {
 *   //     "owner": {account},
 *   //     "id": {dataset id},
 *   //     "name": {dataset name},
 *   //     "description": {dataset description},
 *   //     "created": {timestamp},
 *   //     "modified": {timestamp}
 *   //   },
 *   //   {
 *   //     "owner": {account},
 *   //     "id": {dataset id},
 *   //     "name": {dataset name},
 *   //     "description": {dataset description},
 *   //     "created": {timestamp},
 *   //     "modified": {timestamp}
 *   //   }
 *   // ]
 * });
 */
Datasets.prototype.listDatasets = function(callback) {
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_DATASET_DATASETS, { user: this.user });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

/**
 * To create a new dataset. Valid properties include title and description (not required).
 * This request requires an access token with the datasets:write scope.
 *
 * @param {object} [options] an object defining a dataset's properties
 * @param {string} [options.name] the dataset's name
 * @param {string} [options.description] the dataset's description
 * @param {Function} callback called with (err, dataset)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.createDataset({ name: 'foo', description: 'bar' }, function(err, dataset) {
 *   console.log(dataset);
 *   // {
 *   //   "owner": {account},
 *   //   "id": {dataset id},
 *   //   "name": "foo",
 *   //   "description": "description",
 *   //   "created": {timestamp},
 *   //   "modified": {timestamp}
 *   // }
 * });
 */
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

  var url = makeURL(this, constants.API_DATASET_DATASETS, { user: this.user });

  request
    .post(url)
    .send(options)
    .end(function(err, res) {
      callback(err, res.body);
    });
};

/**
 * To retrieve information about a particular dataset.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, dataset)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.readDataset('dataset-id', function(err, dataset) {
 *   console.log(dataset);
 *   // {
 *   //   "owner": {account},
 *   //   "id": "dataset-id",
 *   //   "name": {dataset name},
 *   //   "description": {dataset description},
 *   //   "created": {timestamp},
 *   //   "modified": {timestamp}
 *   // }
 * });
 */
Datasets.prototype.readDataset = function(dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_DATASET_DATASET, {
    user: this.user,
    dataset: dataset
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

/**
 * To make updates to a particular dataset's properties.
 * This request requires an access token with the datasets:write scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {object} [options] an object defining updates to the dataset's properties
 * @param {string} [options.name] the updated dataset's name
 * @param {string} [options.description] the updated dataset's description
 * @param {Function} callback called with (err, dataset)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * var options = { name: 'foo' };
 * mapboxClient.updateDataset('dataset-id', options, function(err, dataset) {
 *   console.log(dataset);
 *   // {
 *   //   "owner": {account},
 *   //   "id": "dataset-id",
 *   //   "name": "foo",
 *   //   "description": {dataset description},
 *   //   "created": {timestamp},
 *   //   "modified": {timestamp}
 *   // }
 * });
 */
Datasets.prototype.updateDataset = function(dataset, options, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');
  invariant(typeof options === 'object', 'options must be an object');
  invariant(!!options.name || !!options.description, 'options must include a name or a description');

  if (options.name) invariant(typeof options.name === 'string', 'options.name must be a string');
  if (options.description) invariant(typeof options.description === 'string', 'options.description must be a string');

  var url = makeURL(this, constants.API_DATASET_DATASET, {
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

/**
 * To delete a particular dataset.
 * This request requires an access token with the datasets:write scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.deleteDataset('dataset-id', function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
Datasets.prototype.deleteDataset = function(dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_DATASET_DATASET, {
    user: this.user,
    dataset: dataset
  });

  request
    .del(url)
    .end(function(err) {
      callback(err);
    });
};

/**
 * Retrive a list of the features in a particular dataset. The response body will be a GeoJSON FeatureCollection.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, collection)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.listFeatures('dataset-id', function(err, collection) {
 *   console.log(collection);
 *   {
 *     "type": "FeatureCollection",
 *     "features": [
 *       {
 *         "id": {feature id},
 *         "type": "Feature",
 *         "properties": {feature properties}
 *         "geometry": {feature geometry}
 *       },
 *       {
 *         "id": {feature id},
 *         "type": "Feature",
 *         "properties": {feature properties}
 *         "geometry": {feature geometry}
 *       }
 *     ]
 *   }
 * });
 */
Datasets.prototype.listFeatures = function(dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_DATASET_FEATURES, {
    user: this.user,
    dataset: dataset
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

/**
 * Insert a feature into a dataset. This can be a new feature, or overwrite an existing one.
 * If overwriting an existing feature, make sure that the feature's `id` property correctly identifies
 * the feature you wish to overwrite.
 * For new features, specifying an `id` is optional. If you do not specify an `id`, one will be assigned
 * and returned as part of the response.
 * This request requires an access token with the datasets:write scope.
 * There are a number of limits to consider when making this request:
 *   - a single feature cannot be larger than 500 KB
 *   - the dataset must not exceed 2000 total features
 *   - the dataset must not exceed a total of 5 MB
 *
 * @param {object} feature the feature to insert. Must be a valid GeoJSON feature per http://geojson.org/geojson-spec.html#feature-objects
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, feature)
 * @returns {undefined} nothing, calls callback
 * @example
 * // Insert a brand new feature without an id
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * var feature = {
 *   "type": "Feature",
 *   "properties": {
 *     "name": "Null Island"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [0, 0]
 *   }
 * };
 * mapboxClient.insertFeature(feature, 'dataset-id', function(err, feature) {
 *   console.log(feature);
 *   // {
 *   //   "id": {feature id},
 *   //   "type": "Feature",
 *   //   "properties": {
 *   //     "name": "Null Island"
 *   //   },
 *   //   "geometry": {
 *   //     "type": "Point",
 *   //     "coordinates": [0, 0]
 *   //   }
 *   // }
 * });
 * @example
 * // Insert a brand new feature with an id, or overwrite an existing feature at that id
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * var feature = {
 *   "id": "feature-id",
 *   "type": "Feature",
 *   "properties": {
 *     "name": "Null Island"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [0, 0]
 *   }
 * };
 * mapboxClient.insertFeature(feature, 'dataset-id', function(err, feature) {
 *   console.log(feature);
 *   // {
 *   //   "id": "feature-id",
 *   //   "type": "Feature",
 *   //   "properties": {
 *   //     "name": "Null Island"
 *   //   },
 *   //   "geometry": {
 *   //     "type": "Point",
 *   //     "coordinates": [0, 0]
 *   //   }
 *   // }
 * });
 */
Datasets.prototype.insertFeature = function(feature, dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');
  invariant(geojsonhint.hint(feature).length === 0, 'feature must be valid GeoJSON');

  var id = feature.id || hat();
  invariant(typeof id === 'string', 'The GeoJSON feature\'s id must be a string');

  var url = makeURL(this, constants.API_DATASET_FEATURE, {
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

/**
 * Read an existing feature from a dataset.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} id the `id` of the feature to read
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, feature)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.readFeature('feature-id', 'dataset-id', function(err, feature) {
 *   console.log(feature);
 *   // {
 *   //   "id": "feature-id",
 *   //   "type": "Feature",
 *   //   "properties": {
 *   //     "name": "Null Island"
 *   //   },
 *   //   "geometry": {
 *   //     "type": "Point",
 *   //     "coordinates": [0, 0]
 *   //   }
 *   // }
 * });
 */
Datasets.prototype.readFeature = function(id, dataset, callback) {
  invariant(typeof id === 'string', 'id must be a string');
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_DATASET_FEATURE, {
    user: this.user,
    dataset: dataset,
    id: id
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

/**
 * Delete an existing feature from a dataset.
 * This request requires an access token with the datasets:write scope.
 *
 * @param {string} id the `id` of the feature to read
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.deleteFeature('feature-id', 'dataset-id', function(err, feature) {
 *   if (!err) console.log('deleted!');
 * });
 */
Datasets.prototype.deleteFeature = function(id, dataset, callback) {
  invariant(typeof id === 'string', 'id must be a string');
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_DATASET_FEATURE, {
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

/**
 * Perform a batch of inserts, updates, and deletes to a dataset in a single combined request.
 * This request requires an access token with the datasets:write scope.
 * There are a number of limits to consider when making this request:
 *   - you can send a total of 100 changes (sum of puts + deletes) in a single request
 *   - any single feature cannot be larger than 500 KB
 *   - the dataset must not exceed 2000 total features
 *   - the dataset must not exceed a total of 5 MB
 *
 * @param {Array<object>} put features to insert. Each feature must be a valid GeoJSON feature per http://geojson.org/geojson-spec.html#feature-objects
 * @param {Array<string>} deletes ids of features to delete
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * var inserts = [
 *   {
 *     "type": "Feature",
 *     "properties": {
 *       "name": "Null Island"
 *     },
 *     "geometry": {
 *       "type": "Point",
 *       "coordinates": [0, 0]
 *     }
 *   },
 *   {
 *     "type": "Feature",
 *     "properties": {
 *       "name": "Offshore from Null Island"
 *     },
 *     "geometry": {
 *       "type": "Point",
 *       "coordinates": [0.01, 0.01]
 *     }
 *   }
 * ];
 * var deletes =[
 *   'feature-id-1',
 *   'feature-id-2'
 * ];
 * mapboxClient.bulkFeatureUpdate(inserts, deletes, dataset, function(err, results) {
 *  console.log(results);
 * // {
 * //   "put": [
 * //     {
 * //       "id": {feature-id},
 * //       "type": "Feature",
 * //       "properties": {
 * //         "name": "Null Island"
 * //       },
 * //       "geometry": {
 * //         "type": "Point",
 * //         "coordinates": [0, 0]
 * //       }
 * //     },
 * //     {
 * //       "id": {feature-id},
 * //       "type": "Feature",
 * //       "properties": {
 * //         "name": "Offshore from Null Island"
 * //       },
 * //       "geometry": {
 * //         "type": "Point",
 * //         "coordinates": [0.01, 0.01]
 * //       }
 * //     }
 * //   ],
 * //   "delete": [
 * //     "feature-id-1",
 * //     "feature-id-2"
 * //   ]
 * // }
 * });
 */
Datasets.prototype.bulkFeatureUpdate = function(put, deletes, dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  put = put || [];
  invariant(
    geojsonhint.hint({type: 'FeatureCollection', features: put}).length === 0,
    'put must be an array of valid GeoJSON features'
  );
  invariant(
    put.every(function(feature) { return feature.id; }),
    'inserted GeoJSON features must include ids'
  );

  deletes = deletes || [];
  invariant(
    deletes.every(function(id) { return typeof id === 'string'; }),
    'deletes must be an array of strings'
  );

  var url = makeURL(this, constants.API_DATASET_FEATURES, {
    user: this.user,
    dataset: dataset
  });

  request
    .post(url)
    .send({ put: put, delete: deletes })
    .end(function(err, res) {
      callback(err, res.body);
    });
};
