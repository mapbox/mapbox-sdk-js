'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var pick = require('./service-helpers/pick');

/**
 * Uploads API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/maps/#uploads).
 */
var Uploads = {};

/**
 * List the statuses of all recent uploads.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#retrieve-recent-upload-statuses).
 *
 * @param {Object} [config]
 * @param {boolean} [config.reverse] - List uploads in chronological order, rather than reverse chronological order.
 * @return {MapiRequest}
 *
 * @example
 * uploadsClient.listUploads()
 *   .send()
 *   .then(response => {
 *     const uploads = response.body;
 *   });
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
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#retrieve-s3-credentials).
 *
 * @return {MapiRequest}
 *
 * @example
 * const AWS = require('aws-sdk');
 * const getCredentials = () => {
 *   return uploadsClient
 *     .createUploadCredentials()
 *     .send()
 *     .then(response => response.body);
 * }
 * const putFileOnS3 = (credentials) => {
 *   const s3 = new AWS.S3({
 *     accessKeyId: credentials.accessKeyId,
 *     secretAccessKey: credentials.secretAccessKey,
 *     sessionToken: credentials.sessionToken,
 *     region: 'us-east-1'
 *   });
 *   return s3.putObject({
 *     Bucket: credentials.bucket,
 *     Key: credentials.key,
 *     Body: fs.createReadStream('/path/to/file.mbtiles')
 *   }).promise();
 * };
 *
 * getCredentials().then(putFileOnS3);
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
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#create-an-upload).
 *
 * @param {Object} config
 * @param {string} config.tileset - The tileset ID to create or replace, in the format `username.nameoftileset`.
 *   Limited to 32 characters (only `-` and `_` special characters allowed; limit does not include username).
 * @param {string} config.url - HTTPS URL of the S3 object provided by [`createUploadCredentials`](#createuploadcredentials)
 * @param {string} [config.name] - The name of the tileset. Limited to 64 characters.
 * @param {boolean} [config.private=true] - A boolean that describes whether the tileset must be used with an access token from your Mapbox account. Default is true.
 * @return {MapiRequest}
 *
 * @example
 *  // Response from a call to createUploadCredentials
 * const credentials = {
 *   accessKeyId: '{accessKeyId}',
 *   bucket: '{bucket}',
 *   key: '{key}',
 *   secretAccessKey: '{secretAccessKey}',
 *   sessionToken: '{sessionToken}',
 *   url: '{s3 url}'
 * };
 * uploadsClient.createUpload({
 *   titleset: `${myUsername}.${myTileset}`,
 *   url: credentials.url,
 *   name: 'my uploads name',
 *   private: true
 * })
 *   .send()
 *   .then(response => {
 *     const upload = response.body;
 *   });
 */
Uploads.createUpload = function(config) {
  v.assertShape({
    url: v.required(v.string),
    tileset: v.string,
    name: v.string,
    private: v.boolean,
    mapId: v.string,
    tilesetName: v.string
  })(config);

  if (!config.tileset && !config.mapId) {
    throw new Error('tileset or mapId must be defined');
  }

  if (!config.name && !config.tilesetName) {
    throw new Error('name or tilesetName must be defined');
  }

  // Support old mapId option
  if (config.mapId) {
    config.tileset = config.mapId;
  }

  // Support old tilesetName option
  if (config.tilesetName) {
    config.name = config.tilesetName;
  }

  if (config.private !== false) {
    config.private = true;
  }

  return this.client.createRequest({
    method: 'POST',
    path: '/uploads/v1/:ownerId',
    body: pick(config, ['tileset', 'url', 'name', 'private'])
  });
};

/**
 * Get an upload's status.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#retrieve-upload-status).
 *
 * @param {Object} config
 * @param {string} config.uploadId
 * @return {MapiRequest}
 *
 * @example
 * uploadsClient.getUpload({
 *   uploadId: '{upload_id}'
 * })
 *   .send()
 *   .then(response => {
 *     const status = response.body;
 *   });
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
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#remove-an-upload-status).
 *
 * @param {Object} config
 * @param {string} config.uploadId
 * @return {MapiRequest}
 *
 * @example
 * uploadsClient.deleteUpload({
 *   uploadId: '{upload_id}'
 * })
 * .send()
 * .then(response => {
 *   // Upload successfully deleted.
 * });
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
