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
Uploads.prototype.listUploads = function(owner, callback) {
  // defaults to the owner of the provided token if omitted
  if (callback === undefined && typeof owner === 'function') {
    callback = owner;
    owner = this.user;
  }

  invariant(typeof callback === 'function', 'callback must be a function');
  invariant(typeof owner === 'string', 'owner must be a string');

  var url = makeURL(this, constants.API_UPLOADS, { owner: owner });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

Uploads.prototype.createUploadCredentials = function(owner, callback) {
  // defaults to the owner of the provided token if omitted
  if (callback === undefined && typeof owner === 'function') {
    callback = owner;
    owner = this.user;
  }

  invariant(typeof callback === 'function', 'callback must be a function');
  invariant(typeof owner === 'string', 'owner must be a string');

  var url = makeURL(this, constants.API_UPLOAD_CREDENTIALS, { owner: owner });

  request
    .get(url)
    .end(function(err, res) {
      callback(err, res.body);
    });
};

Uploads.prototype.createUpload = function(options, owner, callback) {
  // defaults to the owner of the provided token if omitted
  if (callback === undefined && typeof owner === 'function') {
    callback = owner;
    owner = this.user;
  }

  invariant(typeof options === 'object', 'options must be an object');
  invariant(typeof owner === 'string', 'owner must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_UPLOADS, { owner: owner });

  request
    .post(url)
    .send(options)
    .end(function(err, res) {
      callback(err, res.body);
    });
};

Uploads.prototype.readUpload = function(upload, owner, callback) {
  // defaults to the owner of the provided token if omitted
  if (callback === undefined && typeof owner === 'function') {
    callback = owner;
    owner = this.user;
  }

  invariant(typeof upload === 'string', 'upload must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_UPLOAD, {
    owner: owner,
    upload: upload
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

Uploads.prototype.deleteUpload = function(upload, owner, callback) {
  // defaults to the owner of the provided token if omitted
  if (callback === undefined && typeof owner === 'function') {
    callback = owner;
    owner = this.user;
  }

  invariant(typeof upload === 'string', 'upload must be a string');
  invariant(typeof owner === 'string', 'owner must be a string');
  invariant(typeof callback === 'function', 'callback must be a function');

  var url = makeURL(this, constants.API_UPLOAD, {
    owner: owner,
    upload: upload
  });

  request
    .del(url)
    .end(function(err) {
      callback(err);
    });
};
