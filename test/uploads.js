/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/uploads');
var AWS = require('aws-sdk');
var hat = require('hat');
var fs = require('fs');

test('UploadClient', function(uploadClient) {
  var testStagedFiles = [];
  var testUploads = [];
  var completedUpload;

  uploadClient.test('#createUploadCredentials', function(createUploadCredentials) {
    createUploadCredentials.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      assert.throws(function() {
        client.createUploadCredentials(100, function() {});
      }, 'throws owner must be a string error');
      assert.throws(function() {
        client.createUploadCredentials();
      }, 'throw no callback function error');
      assert.end();
    });

    createUploadCredentials.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');

      client.createUploadCredentials(function(err, credentials) {
        assert.ifError(err, 'success');
        var s3 = new AWS.S3({
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
          region: 'us-east-1'
        });
        s3.putObject({
          Bucket: credentials.bucket,
          Key: credentials.key,
          Body: fs.createReadStream(__dirname + '/fixtures/valid-onlytiles.mbtiles')
        }, function(err, resp) {
          assert.ifError(err, 'success');
          testStagedFiles.push({
            bucket: credentials.bucket,
            key: credentials.key
          });
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
      assert.throws(function() {
        client.createUpload();
      }, 'throws no callback function error');
      assert.end();
    });

    createUpload.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      var staged = testStagedFiles.shift();
      var url = 'http://' + staged.bucket + '.s3.amazonaws.com/' + staged.key;
      client.createUpload({
        tileset: [client.user, hat()].join('.'),
        url: url
      }, function(err, upload) {
        assert.ifError(err, 'success');
        testUploads.push(upload);
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
      assert.throws(function() {
        client.readUpload();
      }, 'throws no callback function error');
      assert.end();
    });

    readUpload.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      var upload = testUploads.shift();
      var attempts = 0;
      function poll() {
        client.readUpload(upload.id, function(err, upload) {
          assert.ifError(err, 'success');
          if (attempts > 10) throw new Error('Upload did not complete in time');
          // we are waiting for mapbox to process the upload
          if (!upload.complete) return setTimeout(poll, Math.pow(2, attempts++) * 1000);
          completedUpload = upload;
          assert.end();
        });
      }
      poll();
    });

    readUpload.end();
  });

  uploadClient.test('#listUploads', function(listUploads) {
    listUploads.test('typecheck', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      assert.throws(function() {
        client.listUploads(100, function() {});
      }, 'throws owner must be a string error');
      assert.throws(function() {
        client.listUploads();
      }, 'throws no callback function error');
      assert.end();
    });

    listUploads.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      client.listUploads(function(err, uploads) {
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
      assert.throws(function() {
        client.deleteUpload();
      }, 'throws no callback function error');
      assert.end();
    });

    deleteUpload.test('valid request', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created upload client');
      var upload = testUploads.shift();
      client.deleteUpload(completedUpload.id, function(err, uploads) {
        assert.ifError(err, 'success');
        assert.end();
      });
    });

    deleteUpload.end();
  });

  uploadClient.end();
});
