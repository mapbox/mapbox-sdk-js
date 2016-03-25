'use strict';

var invariant = require('../../vendor/invariant'),
  hat = require('../../vendor/hat'),
  makeService = require('../make_service'),
  constants = require('../constants');

var Datasets = module.exports = makeService('MapboxDatasets');

/**
 * To retrieve a listing of datasets for a particular account.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {Function} callback called with (err, datasets)
 * @returns {undefined} nothing, calls callback
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listDatasets(function(err, datasets) {
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
  return this.client({
    path: constants.API_DATASET_DATASETS,
    params: {
      owner: this.owner
    },
    callback: callback
  }).entity();
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
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createDataset({ name: 'foo', description: 'bar' }, function(err, dataset) {
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

  return this.client({
    path: constants.API_DATASET_DATASETS,
    params: {
      owner: this.owner
    },
    entity: options,
    callback: callback
  }).entity();
};

/**
 * To retrieve information about a particular dataset.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, dataset)
 * @returns {undefined} nothing, calls callback
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readDataset('dataset-id', function(err, dataset) {
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

  return this.client({
    path: constants.API_DATASET_DATASET,
    params: {
      owner: this.owner,
      dataset: dataset
    },
    callback: callback
  }).entity();
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
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var options = { name: 'foo' };
 * client.updateDataset('dataset-id', options, function(err, dataset) {
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
  invariant(typeof options === 'object', 'options must be an object');
  invariant(!!options.name || !!options.description, 'options must include a name or a description');

  return this.client({
    path: constants.API_DATASET_DATASET,
    params: {
      owner: this.owner,
      dataset: dataset
    },
    method: 'patch',
    entity: options,
    callback: callback
  }).entity();
};

/**
 * To delete a particular dataset.
 * This request requires an access token with the datasets:write scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteDataset('dataset-id', function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
Datasets.prototype.deleteDataset = function(dataset, callback) {
  invariant(typeof dataset === 'string', 'dataset must be a string');

  return this.client({
    path: constants.API_DATASET_DATASET,
    params: {
      owner: this.owner,
      dataset: dataset
    },
    method: 'delete',
    callback: callback
  }).entity();
};

/**
 * Retrive a list of the features in a particular dataset. The response body will be a GeoJSON FeatureCollection.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {object} [options] an object for passing pagination arguments
 * @param {boolean} [options.reverse] Set to `true` to reverse the default sort order of the listing.
 * @param {number} [options.limit] The maximum number of objects to return. This value must be between 1 and 100. The API will attempt to return the requested number of objects, but receiving fewer objects does not necessarily signal the end of the collection. Receiving an empty page of results is the only way to determine when you are at the end of a collection.
 * @param {string} [options.start] The object id that acts as the cursor for pagination and defines your location in the collection. This argument is exclusive so the object associated with the id provided to the start argument will not be included in the response.
 * @param {Function} callback called with (err, collection)
 * @returns {undefined} nothing, calls callback
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listFeatures('dataset-id', options, function(err, collection) {
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
Datasets.prototype.listFeatures = function(dataset, options, callback) {
  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  invariant(typeof dataset === 'string', 'dataset must be a string');
  invariant(typeof options === 'object', 'options must be a object');

  var params = {
    owner: this.owner,
    dataset: dataset
  };

  if (options.reverse) {
    invariant(typeof options.reverse === 'boolean', 'reverse option must be a boolean');
    params.reverse = options.reverse;
  }

  if (options.limit) {
    invariant(typeof options.limit === 'number', 'limit option must be a number');
    params.limit = options.limit;
  }

  if (options.start) {
    invariant(typeof options.start === 'string', 'start option must be a string');
    params.start = options.start;
  }

  return this.client({
    path: constants.API_DATASET_FEATURES,
    params: params,
    callback: callback
  }).entity();
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
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
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
 * client.insertFeature(feature, 'dataset-id', function(err, feature) {
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
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
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
 * client.insertFeature(feature, 'dataset-id', function(err, feature) {
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

  var id = feature.id || hat();
  invariant(typeof id === 'string', 'The GeoJSON feature\'s id must be a string');

  return this.client({
    path: constants.API_DATASET_FEATURE,
    params: {
      owner: this.owner,
      dataset: dataset,
      id: id
    },
    method: 'put',
    entity: feature,
    callback: callback
  }).entity();
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
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readFeature('feature-id', 'dataset-id', function(err, feature) {
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

  return this.client({
    path: constants.API_DATASET_FEATURE,
    params: {
      owner: this.owner,
      dataset: dataset,
      id: id
    },
    callback: callback
  }).entity();
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
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteFeature('feature-id', 'dataset-id', function(err, feature) {
 *   if (!err) console.log('deleted!');
 * });
 */
Datasets.prototype.deleteFeature = function(id, dataset, callback) {
  invariant(typeof id === 'string', 'id must be a string');
  invariant(typeof dataset === 'string', 'dataset must be a string');

  return this.client({
    path: constants.API_DATASET_FEATURE,
    params: {
      owner: this.owner,
      dataset: dataset,
      id: id
    },
    method: 'delete',
    callback: callback
  }).entity();
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
 * @param {object} update an object describing features in insert and/or delete
 * @param {Array<object>} [update.put] features to insert. Each feature must be a valid GeoJSON feature per http://geojson.org/geojson-spec.html#feature-objects
 * @param {Array<string>} [update.delete] ids of features to delete
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var inserts = [
 *   {
 *     "id": "1",
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
 *     "id": "2",
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
 * client.batchFeatureUpdate({ put: inserts, delete: deletes }, dataset, function(err, results) {
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
Datasets.prototype.batchFeatureUpdate = function(update, dataset, callback) {
  invariant(typeof update === 'object', 'update must be an object');
  invariant(typeof dataset === 'string', 'dataset must be a string');

  var inserts = update.put || [];
  var deletes = update.delete || [];

  invariant(
    inserts.every(function(feature) { return feature.id; }),
    'inserted GeoJSON features must include ids'
  );

  invariant(
    deletes.every(function(id) { return typeof id === 'string'; }),
    'update.delete must be an array of strings'
  );

  return this.client({
    path: constants.API_DATASET_FEATURES,
    params: {
      owner: this.owner,
      dataset: dataset
    },
    method: 'post',
    entity: { put: inserts, delete: deletes },
    callback: callback
  }).entity();
};
