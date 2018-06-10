'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Uploads API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://www.mapbox.com/api-documentation/#uploads).
 */
var Uploads = {};

/**
 * List the statuses of all recent uploads.
 *
 * See the [corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/#retrieve-recent-upload-statuses).
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
 * Create S3 credentials.
 *
 * See the [corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/#retrieve-s3-credentials).
 *
 * @return {MapiRequest}
 */
Uploads.createUploadCredentials = function() {
  return this.client.createRequest({
    method: 'POST',
    path: '/uploads/v1/:ownerId/credentials'
  });
};

/**
 * Create an upload.
 *
 * See the [corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/#create-an-upload).
 *
 * @param {Object} config
 * @param {string} config.mapId - The map ID to create or replace in the format `username.nameoftileset`.
 *   Limited to 32 characters (only `-` and `_` special characters allowed; limit does not include username).
 * @param {string} config.url - Either of the following:
 *   - HTTPS URL of the S3 object provided by [`createUploadCredentials`](#createuploadcredentials)
 *   - The `mapbox://` URL of an existing dataset that you'd like to export to a tileset.
 *     This should be in the format `mapbox://datasets/{username}/{datasetId}`.
 * @param {string} [config.tilesetName] - Name for the tileset. Limited to 64 characters.
 * @return {MapiRequest}
 */
Uploads.createUpload = function(config) {
  v.assertShape({
    mapId: v.required(v.string),
    url: v.required(v.string),
    tilesetName: v.string
  })(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/uploads/v1/:ownerId',
    body: {
      tileset: config.mapId,
      url: config.url,
      name: config.tilesetName
    }
  });
};

/**
 * Get an upload's status.
 *
 * See the [corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/#retrieve-upload-status).
 *
 * @param {Object} config
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
 * See the [corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/#remove-an-upload).
 *
 * @param {Object} config
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
