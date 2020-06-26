'use strict';

var v = require('./service-helpers/validator');
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Datasets API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/maps/#datasets).
 */
var Datasets = {};

/**
 * List datasets in your account.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#list-datasets).
 *
 * @param {Object} [config]
 * @param {string} [config.sortby=created] - Sort by either `modified` or `created` (default) dates.
 * @return {MapiRequest}
 *
 * @example
 * datasetsClient.listDatasets()
 *   .send()
 *   .then(response => {
 *     const datasets = response.body;
 *   });
 *
 * @example
 * datasetsClient.listDatasets()
 *   .eachPage((error, response, next) => {
 *     // Handle error or response and call next.
 *   });
 */
Datasets.listDatasets = function(config) {
  v.assertShape({
    sortby: v.oneOf('created', 'modified')
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/datasets/v1/:ownerId',
    query: config ? pick(config, ['sortby']) : {}
  });
};

/**
 * Create a new, empty dataset.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#create-a-dataset).
 *
 * @param {Object} config
 * @param {string} [config.name]
 * @param {string} [config.description]
 * @return {MapiRequest}
 *
 * @example
 * datasetsClient.createDataset({
 *   name: 'example',
 *   description: 'An example dataset'
 * })
 *   .send()
 *   .then(response => {
 *     const datasetMetadata = response.body;
 *   });
 */
Datasets.createDataset = function(config) {
  v.assertShape({
    name: v.string,
    description: v.string
  })(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/datasets/v1/:ownerId',
    body: config
  });
};

/**
 * Get metadata about a dataset.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#retrieve-a-dataset).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @return {MapiRequest}
 *
 * @example
 * datasetsClient.getMetadata({
 *   datasetId: 'dataset-id'
 * })
 *   .send()
 *   .then(response => {
 *     const datasetMetadata = response.body;
 *   })
 */
Datasets.getMetadata = function(config) {
  v.assertShape({
    datasetId: v.required(v.string),
    description: v.string
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/datasets/v1/:ownerId/:datasetId',
    params: config
  });
};

/**
 * Update user-defined properties of a dataset's metadata.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#update-a-dataset).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @param {string} [config.name]
 * @param {string} [config.description]
 * @return {MapiRequest}
 *
 * @example
 * datasetsClient.updateMetadata({
 *   datasetId: 'dataset-id',
 *   name: 'foo'
 * })
 *   .send()
 *   .then(response => {
 *     const datasetMetadata = response.body;
 *   });
 */
Datasets.updateMetadata = function(config) {
  v.assertShape({
    datasetId: v.required(v.string),
    name: v.string,
    description: v.string
  })(config);

  return this.client.createRequest({
    method: 'PATCH',
    path: '/datasets/v1/:ownerId/:datasetId',
    params: pick(config, ['datasetId']),
    body: pick(config, ['name', 'description'])
  });
};

/**
 * Delete a dataset, including all features it contains.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#delete-a-dataset).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @return {MapiRequest}
 *
 * @example
 * datasetsClient.deleteDataset({
 *   datasetId: 'dataset-id'
 * })
 *   .send()
 *   .then(response => {
 *     // Dataset is successfully deleted.
 *   });
 */
Datasets.deleteDataset = function(config) {
  v.assertShape({
    datasetId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/datasets/v1/:ownerId/:datasetId',
    params: config
  });
};

/**
 * List features in a dataset.
 *
 * This endpoint supports pagination. Use `MapiRequest#eachPage` or manually specify
 * the `limit` and `start` options.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#list-features).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @param {number} [config.limit] - Only list this number of features.
 * @param {string} [config.start] - The ID of the feature from which the listing should
 *   start.
 * @return {MapiRequest}
 *
 * @example
 * datasetsClient.listFeatures({
 *   datasetId: 'dataset-id'
 * })
 *   .send()
 *   .then(response => {
 *     const features = response.body;
 *   });
 */
Datasets.listFeatures = function(config) {
  v.assertShape({
    datasetId: v.required(v.string),
    limit: v.number,
    start: v.string
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/datasets/v1/:ownerId/:datasetId/features',
    params: pick(config, ['datasetId']),
    query: pick(config, ['limit', 'start'])
  });
};

/**
 * Add a feature to a dataset or update an existing one.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#insert-or-update-a-feature).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @param {string} config.featureId
 * @param {Object} config.feature - Valid GeoJSON that is not a `FeatureCollection`.
 *   If the feature has a top-level `id` property, it must match the `featureId` you specify.
 * @return {MapiRequest}
 *
 * @example
 * datasetsClient.putFeature({
 *   datasetId: 'dataset-id',
 *   featureId: 'null-island',
 *   feature: {
 *     "type": "Feature",
 *     "properties": { "name": "Null Island" },
 *     "geometry": {
 *       "type": "Point",
 *       "coordinates": [0, 0]
 *     }
 *   }
 * })
 *   .send()
 *   .then(response => {
 *     const feature = response.body;
 *   });
 */
Datasets.putFeature = function(config) {
  v.assertShape({
    datasetId: v.required(v.string),
    featureId: v.required(v.string),
    feature: v.required(v.plainObject)
  })(config);

  if (
    config.feature.id !== undefined &&
    config.feature.id !== config.featureId
  ) {
    throw new Error('featureId must match the id property of the feature');
  }

  return this.client.createRequest({
    method: 'PUT',
    path: '/datasets/v1/:ownerId/:datasetId/features/:featureId',
    params: pick(config, ['datasetId', 'featureId']),
    body: config.feature
  });
};

/**
 * Get a feature in a dataset.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#retrieve-a-feature).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @param {string} config.featureId
 * @return {MapiRequest}
 *
 * @example
 * datasetsClient.getFeature({
 *   datasetId: 'dataset-id',
 *   featureId: 'feature-id'
 * })
 *   .send()
 *   .then(response => {
 *     const feature = response.body;
 *   });
 */
Datasets.getFeature = function(config) {
  v.assertShape({
    datasetId: v.required(v.string),
    featureId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/datasets/v1/:ownerId/:datasetId/features/:featureId',
    params: config
  });
};

/**
 * Delete a feature in a dataset.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#delete-a-feature).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @param {string} config.featureId
 * @return {MapiRequest}
 *
 * @example
 * datasetsClient.deleteFeature({
 *   datasetId: 'dataset-id',
 *   featureId: 'feature-id'
 * })
 *   .send()
 *   .then(response => {
 *     // Feature is successfully deleted.
 *   });
 */
Datasets.deleteFeature = function(config) {
  v.assertShape({
    datasetId: v.required(v.string),
    featureId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/datasets/v1/:ownerId/:datasetId/features/:featureId',
    params: config
  });
};

module.exports = createServiceFactory(Datasets);
