'use strict';

var v = require('./service-helpers/validator').v;
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Datasets API service.
 */
var Datasets = {};

/**
 * List datasets in your account.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#list-datasets).
 *
 * @return {MapiRequest}
 */
Datasets.listDatasets = function(config) {
  v.warn(v.shapeOf({}))(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/datasets/v1/:ownerId'
  });
};

/**
 * Create a new dataset.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#create-dataset).
 *
 * @param {Object} config
 * @param {string} [config.name]
 * @param {string} [config.description]
 * @return {MapiRequest}
 */
Datasets.createDataset = function(config) {
  v.warn(
    v.shapeOf({
      name: v.string,
      description: v.string
    })
  )(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/datasets/v1/:ownerId',
    body: config
  });
};

/**
 * Get a dataset.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#retrieve-a-dataset).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @return {MapiRequest}
 */
Datasets.getDataset = function(config) {
  v.warn(
    v.shapeOf({
      datasetId: v.required(v.string),
      description: v.string
    })
  )(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/datasets/v1/:ownerId/:datasetId',
    params: config
  });
};

/**
 * Update the properties of a dataset.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#update-a-dataset).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @param {string} [config.name]
 * @param {string} [config.description]
 * @return {MapiRequest}
 */
Datasets.updateDataset = function(config) {
  v.warn(
    v.shapeOf({
      datasetId: v.required(v.string),
      name: v.string,
      description: v.string
    })
  )(config);

  return this.client.createRequest({
    method: 'PATCH',
    path: '/datasets/v1/:ownerId/:datasetId',
    params: pick(config, ['datasetId']),
    body: pick(config, ['name', 'description'])
  });
};

/**
 * Delete a dataset.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#delete-a-dataset).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @return {MapiRequest}
 */
Datasets.deleteDataset = function(config) {
  v.warn(
    v.shapeOf({
      datasetId: v.required(v.string)
    })
  )(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/datasets/v1/:ownerId/:datasetId',
    params: config
  });
};

/**
 * List features in a dataset.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#list-features).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @param {number} [config.limit] - Only list this number of features.
 * @param {string} [config.start] - The ID of the feature from which the listing should
 *   start.
 * @return {MapiRequest}
 */
Datasets.listFeatures = function(config) {
  v.warn(
    v.shapeOf({
      datasetId: v.required(v.string),
      limit: v.number,
      start: v.string
    })
  )(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/datasets/v1/:ownerId/:datasetId/features',
    params: pick(config, ['datasetId']),
    query: pick(config, ['limit', 'start'])
  });
};

/**
 * Add a feature to a dataset, or update an existing one.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#insert-or-update-a-feature).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @param {string} config.featureId
 * @param {Object} config.feature
 * @return {MapiRequest}
 */
Datasets.putFeature = function(config) {
  v.warn(
    v.shapeOf({
      datasetId: v.required(v.string),
      featureId: v.required(v.string),
      feature: v.required(v.plainObject)
    })
  )(config);

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
 * See the [public documentation](https://www.mapbox.com/api-documentation/#retrieve-a-feature).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @param {string} config.featureId
 * @return {MapiRequest}
 */
Datasets.getFeature = function(config) {
  v.warn(
    v.shapeOf({
      datasetId: v.required(v.string),
      featureId: v.required(v.string)
    })
  )(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/datasets/v1/:ownerId/:datasetId/features/:featureId',
    params: config
  });
};

/**
 * Delete a feature in a dataset.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#delete-a-feature).
 *
 * @param {Object} config
 * @param {string} config.datasetId
 * @param {string} config.featureId
 * @return {MapiRequest}
 */
Datasets.deleteFeature = function(config) {
  v.warn(
    v.shapeOf({
      datasetId: v.required(v.string),
      featureId: v.required(v.string)
    })
  )(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/datasets/v1/:ownerId/:datasetId/features/:featureId',
    params: config
  });
};

module.exports = createServiceFactory(Datasets);
