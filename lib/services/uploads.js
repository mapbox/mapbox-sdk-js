'use strict';

var invariant = require('../../vendor/invariant'),
  makeService = require('../make_service'),
  constants = require('../constants');

var Uploads = module.exports = makeService('MapboxUploads');

/**
 * Retrieve a listing of uploads for a particular account.
 *
 * This request requires an access token with the uploads:list scope.
 *
 * @param {Function} callback called with (err, uploads)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.listUploads(function(err, uploads) {
 *   console.log(uploads);
 *   // [
 *   //   {
 *   //     "complete": true,
 *   //     "tileset": "example.mbtiles",
 *   //     "error": null,
 *   //     "id": "abc123",
 *   //     "modified": "2014-11-21T19:41:10.000Z",
 *   //     "created": "2014-11-21T19:41:10.000Z",
 *   //     "owner": "example",
 *   //     "progress": 1
 *   //   },
 *   //   {
 *   //     "complete": false,
 *   //     "tileset": "example.foo",
 *   //     "error": null,
 *   //     "id": "xyz789",
 *   //     "modified": "2014-11-21T19:41:10.000Z",
 *   //     "created": "2014-11-21T19:41:10.000Z",
 *   //     "owner": "example",
 *   //     "progress": 0
 *   //   }
 *   // ]
 * });
 */
Uploads.prototype.listUploads = function(callback) {
  return this.client({
    path: constants.API_UPLOADS,
    params: { owner: this.owner },
    callback: callback
  }).entity();
};

/**
 * Retrieve credentials that allow a new file to be staged on Amazon S3
 * while an upload is processed. All uploads must be staged using these
 * credentials before being uploaded to Mapbox.
 *
 * This request requires an access token with the uploads:write scope.
 *
 * @param {Function} callback called with (err, credentials)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.createUploadCredentials(function(err, credentials) {
 *   console.log(credentials);
 *   // {
 *   //   "accessKeyId": "{accessKeyId}",
 *   //   "bucket": "somebucket",
 *   //   "key": "hij456",
 *   //   "secretAccessKey": "{secretAccessKey}",
 *   //   "sessionToken": "{sessionToken}",
 *   //   "url": "{s3 url}"
 *   // }
 *
 *   // Use aws-sdk to stage the file on Amazon S3
 *   var AWS = require('aws-sdk');
 *   var s3 = new AWS.S3({
 *        accessKeyId: credentials.accessKeyId,
 *        secretAccessKey: credentials.secretAccessKey,
 *        sessionToken: credentials.sessionToken,
 *        region: 'us-east-1'
 *   });
 *   s3.putObject({
 *     Bucket: credentials.bucket,
 *     Key: credentials.key,
 *     Body: fs.createReadStream('/path/to/file.mbtiles')
 *   }, function(err, resp) {
 *   });
 * });
 */
Uploads.prototype.createUploadCredentials = function(callback) {
  return this.client({
    path: constants.API_UPLOAD_CREDENTIALS,
    params: { owner: this.owner },
    callback: callback
  }).entity();
};

/**
 * Create an new upload with a file previously staged on Amazon S3.
 *
 * This request requires an access token with the uploads:write scope.
 *
 * @param {Object} options an object that defines the upload's properties
 * @param {String} options.tileset id of the tileset to create or
 * replace. This must consist of an account id and a unique key
 * separated by a period. Reuse of a tileset value will overwrite
 * existing data. To avoid overwriting existing data, you must ensure
 * that you are using unique tileset ids.
 * @param {String} options.url https url of a file staged on Amazon S3.
 * @param {Function} callback called with (err, upload)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * // Response from a call to createUploadCredentials
 * var credentials = {
 *   "accessKeyId": "{accessKeyId}",
 *   "bucket": "somebucket",
 *   "key": "hij456",
 *   "secretAccessKey": "{secretAccessKey}",
 *   "sessionToken": "{sessionToken}",
 *   "url": "{s3 url}"
 * };
 * mapboxClient.createUpload({
 *    tileset: [accountid, 'mytileset'].join('.'),
 *    url: credentials.url
 * }, function(err, upload) {
 *   console.log(upload);
 *   // {
 *   //   "complete": false,
 *   //   "tileset": "example.markers",
 *   //   "error": null,
 *   //   "id": "hij456",
 *   //   "modified": "2014-11-21T19:41:10.000Z",
 *   //   "created": "2014-11-21T19:41:10.000Z",
 *   //   "owner": "example",
 *   //   "progress": 0
 *   // }
 * });
 */
Uploads.prototype.createUpload = function(options, callback) {
  invariant(typeof options === 'object', 'options must be an object');

  return this.client({
    path: constants.API_UPLOADS,
    params: { owner: this.owner },
    entity: options,
    callback: callback
  }).entity();
};

/**
 * Retrieve state of an upload.
 *
 * This request requires an access token with the uploads:read scope.
 *
 * @param {String} upload id of the upload to read
 * @param {Function} callback called with (err, upload)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.readUpload('hij456', function(err, upload) {
 *   console.log(upload);
 *   // {
 *   //   "complete": true,
 *   //   "tileset": "example.markers",
 *   //   "error": null,
 *   //   "id": "hij456",
 *   //   "modified": "2014-11-21T19:41:10.000Z",
 *   //   "created": "2014-11-21T19:41:10.000Z",
 *   //   "owner": "example",
 *   //   "progress": 1
 *   // }
 * });
 */
Uploads.prototype.readUpload = function(upload, callback) {
  invariant(typeof upload === 'string', 'upload must be a string');

  return this.client({
    path: constants.API_UPLOAD,
    params: {
      owner: this.owner,
      upload: upload
    },
    callback: callback
  }).entity();
};

/**
 * Delete a completed upload. In-progress uploads cannot be deleted.
 *
 * This request requires an access token with the uploads:delete scope.
 *
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.deleteUpload('hij456', function(err) {
 * });
 */
Uploads.prototype.deleteUpload = function(upload, callback) {
  invariant(typeof upload === 'string', 'upload must be a string');

  return this.client({
    method: 'delete',
    path: constants.API_UPLOAD,
    params: {
      owner: this.owner,
      upload: upload
    },
    callback: callback
  }).entity();
};
