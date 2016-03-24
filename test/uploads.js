/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/uploads');
var AWS = require('aws-sdk');
var hat = require('../vendor/hat');
var path = require('path');
var fs = require('fs');

test('UploadClient', function(uploadClient) {

  if (process.browser) {
    uploadClient.pass('skipping dataset api in browser');
    return uploadClient.end();
  }

  var testStagedFiles = [];
  var testUploads = [];
  var completedUpload;

  uploadClient.test('#createUploadCredentials', function(createUploadCredentials) {
    createUploadCredentials.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      assert.end();
    });

    createUploadCredentials.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');

      client.createUploadCredentials(function(err, credentials) {
        assert.ifError(err, 'success');
        assert.ok(credentials, 'has credentials');
        assert.ok(credentials.accessKeyId, 'has accessKeyId');
        assert.ok(credentials.bucket, 'has bucket');
        assert.ok(credentials.key, 'has key');
        assert.ok(credentials.secretAccessKey, 'has secretAccessKey');
        assert.ok(credentials.sessionToken, 'has sessionToken');
        var s3 = new AWS.S3({
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
          region: 'us-east-1'
        });
        s3.putObject({
          Bucket: credentials.bucket,
          Key: credentials.key,
          Body: fs.readFileSync(path.join(__dirname, '/fixtures/valid-onlytiles.mbtiles'))
        }, function(err /*, resp */) {
          assert.ifError(err, 'success');
          testStagedFiles.push(credentials);
          assert.end();
        });
      });
    });

    createUploadCredentials.end();
  });

  uploadClient.test('#createUpload', function(createUpload) {
    createUpload.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      assert.throws(function() {
        client.createUpload('ham', function() {});
      }, 'throws option not an object error');
      assert.end();
    });

    createUpload.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      var staged = testStagedFiles.shift();
      client.createUpload({
        tileset: [client.owner, hat()].join('.'),
        url: staged.url
      }, function(err, upload) {
        assert.ifError(err, 'success');
        assert.ok(upload.id, 'has id');
        assert.ok(upload.complete === false, 'has complete');
        assert.ok(upload.tileset, 'has tileset');
        assert.ok(upload.error === null, 'has error');
        assert.ok(upload.modified, 'has modified');
        assert.ok(upload.created, 'has created');
        assert.ok(upload.owner, 'has owner');
        assert.ok(upload.progress === 0, 'has progress');
        testUploads.push(upload);
        assert.end();
      });
    });

    createUpload.test('invalid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      client.createUpload({
        tileset: 'blah'
      }, function(err /*, upload */) {
        assert.equal(err.message, 'Missing property "url"');
        assert.end();
      });
    });

    createUpload.end();
  });

  uploadClient.test('#readUpload', function(readUpload) {
    readUpload.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      assert.throws(function() {
        client.readUpload(100, function() {});
      }, 'throws owner must be a string error');
      assert.end();
    });

    readUpload.test('valid request', function(assert) {
      assert.plan(2);
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      var upload = testUploads.shift();
      var attempts = 0;
      function poll() {
        client.readUpload(upload.id, function(err, upload) {
          if (attempts > 4) throw new Error('Upload did not complete in time');
          // we are waiting for mapbox to process the upload
          if (!upload.complete) return setTimeout(poll, Math.pow(2, attempts++) * 1000);
          assert.ifError(err, 'success');
          completedUpload = upload;
        });
      }
      poll();
    }, { timeout: 10000 });

    readUpload.test('does not exist', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      client.readUpload('fakeo', function(err /*, upload */) {
        assert.equal(err.message, 'Not Found');
        assert.end();
      });
    });

    readUpload.end();
  });

  uploadClient.test('#listUploads', function(listUploads) {
    listUploads.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      assert.end();
    });

    listUploads.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      client.listUploads(function(err/*, uploads */) {
        assert.ifError(err, 'success');
        assert.end();
      });
    });

    listUploads.end();
  });

  uploadClient.test('#deleteUpload', function(deleteUpload) {
    deleteUpload.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      assert.throws(function() {
        client.deleteUpload(100, function() {});
      }, 'throws owner must be a string error');
      assert.end();
    });

    deleteUpload.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      var upload = testUploads.shift();
      client.deleteUpload(completedUpload.id, function(err/*, uploads*/) {
        assert.ifError(err, 'success');
        assert.end();
      });
    });

    deleteUpload.end();
  });

  uploadClient.end();
});
