'use strict';

var invariant = require('invariant'),
  request = require('superagent'),
  makeService = require('../make_service'),
  constants = require('../constants'),
  makeURL = require('../make_url');

var Uploads = module.exports = makeService('MapboxUploads');

/**
 * To retrieve a listing of uploads for a particular account.
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
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_UPLOADS, { owner: this.user });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

Uploads.prototype.createUploadCredentials = function(callback) {
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_UPLOAD_CREDENTIALS, { owner: this.user });

  request
    .get(url)
    .end(function(err, res) {
      callback(err, res.body);
    });
};

Uploads.prototype.createUpload = function(options, callback) {
  invariant(typeof options === 'object', 'options must be an object');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_UPLOADS, { owner: this.user });

  request
    .post(url)
    .send(options)
    .end(function(err, res) {
      callback(err, res.body);
    });
};

Uploads.prototype.readUpload = function(upload, callback) {
  invariant(typeof upload === 'string', 'upload must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_UPLOAD, {
    owner: this.user,
    upload: upload
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

Uploads.prototype.deleteUpload = function(upload, callback) {
  invariant(typeof upload === 'string', 'upload must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_UPLOAD, {
    owner: this.user,
    upload: upload
  });

  request
    .del(url)
    .end(function(err) {
      callback(err);
    });
};
