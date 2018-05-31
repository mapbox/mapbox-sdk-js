'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Uploads API service.
 */
var Uploads = {};

/**
 * List all recent upload statuses
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#uploads).
 *
 * @param {Object} [config]
 * @param {boolean} [config.reverse] - List uploads in chronological order, rather than reverse chronological order.
 * @return {MapiRequest}
 */
Uploads.listUploads = function(config) {
  v.assertShape({
    reverse: v.boolean
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/uploads/v1/:ownerId',
    query: config
  });
};

/**
 * Create s3 credentials.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#retrieve-s3-credentials).
 *
 * @param {Object} [config]
 * @return {MapiRequest}
 */
Uploads.createUploadCredentials = function(config) {
  v.assertShape({})(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/uploads/v1/:ownerId/credentials'
  });
};

/**
 * Create an upload.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#create-an-upload).
 *
 * @param {Object} [config
 * @param {string} config.tileset - the map ID to create or replace in the format  username.nameoftileset - limited to 32 characters (only  - and  _ special characters allowed, limit does not include username)
 * @param {string} config.url - HTTPS URL of the S3 object provided in the credential request or the dataset ID of an existing Mapbox dataset to be uploaded
 * @param {string} [config.name] - name for the tileset - limited to 64 characters
 * @return {MapiRequest}
 */
Uploads.createUpload = function(config) {
  v.assertShape({
    tileset: v.required(v.string),
    url: v.required(v.string),
    name: v.string
  })(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/uploads/v1/:ownerId',
    body: config
  });
};

/**
 * Get an upload status.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#retrieve-upload-status).
 *
 * @param {Object} [config
 * @param {string} config.uploadId
 * @return {MapiRequest}
 */
Uploads.getUpload = function(config) {
  v.assertShape({
    uploadId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/uploads/v1/:ownerId/:uploadId',
    params: config
  });
};

/**
 * Delete an upload.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#remove-an-upload).
 *
 * @param {Object} [config
 * @param {string} config.uploadId
 * @return {MapiRequest}
 */
Uploads.deleteUpload = function(config) {
  v.assertShape({
    uploadId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/uploads/v1/:ownerId/:uploadId',
    params: config
  });
};

module.exports = createServiceFactory(Uploads);
