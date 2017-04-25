/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../lib/services/tokens');

/*
 * Requires the MapboxAccessToken environment variable to be set with scopes 'tokens:list', 'tokens:write', 'scopes:list'
 */
test('TokenClient', function(tokenClient) {

  var newTokenId;

  tokenClient.test('#createToken', function(createToken) {

    createToken.test('valid scopes', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created token client');
      var newTokenNote = 'mapbox-sdk-js createToken test';
      var newTokenScopes = ['fonts:read'];
      client.createToken(newTokenNote, newTokenScopes, function(err, token) {
        assert.ifError(err, 'success');
        assert.equal(token.note, newTokenNote, 'note set');
        assert.deepEqual(token.scopes, newTokenScopes, 'scopes set');
        newTokenId = token.id;
        assert.end();
      });
    });

    createToken.test('invalid scopes', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created token client');
      var newTokenNote = 'mapbox-sdk-js createToken test';
      var newTokenScopes = ['not:a:valid:scope'];
      client.createToken(newTokenNote, newTokenScopes, function(err) {
        assert.ok(err, 'error');
        assert.equal(err.message, 'scopes are invalid', 'error message');
        assert.end();
      });
    });

    createToken.end();
  });

  tokenClient.test('#retrieveToken', function(retrieveToken) {

    retrieveToken.test('valid token', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created token client');
      client.retrieveToken(process.env.MapboxAccessToken, function(err, tokenStatus) {
        assert.ifError(err, 'success');
        assert.equal(tokenStatus.code, 'TokenValid');
        assert.end();
      });
    });

    retrieveToken.test('invalid token', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created token client');
      client.retrieveToken('pk.abc.123', function(err, tokenStatus) {
        assert.ifError(err, 'success');
        assert.equal(tokenStatus.code, 'TokenInvalid');
        assert.end();
      });
    });

    retrieveToken.end();
  });

  tokenClient.test('#listScopes', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created token client');
    client.listScopes(function(err, scopes) {
      assert.ifError(err, 'scopes could not be listed');
      assert.equal(scopes.filter(function (scope) { return scope.id === 'scopes:list'; }).length, 1, 'listing all scopes should include the scopes:list scope');
      assert.end();
    });
  });

  tokenClient.test('#createTemporaryToken', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created token client');
    var expires = new Date(new Date().getTime() + 10000).toISOString();
    client.createTemporaryToken(expires, ['styles:read'], function(err, token) {
      assert.ifError(err, 'success');
      assert.ok(token.token, 'token exists');
      assert.end();
    });
  });

  tokenClient.test('#listTokens', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created token client');
    client.listTokens(function(err, tokens) {
      assert.ifError(err, 'success');
      assert.ok(Array.isArray(tokens), 'lists tokens');
      tokens.forEach(function(token) {
        assert.ok(token.id, 'Each token has an id');
      });
      assert.end();
    });
  });

  tokenClient.test('#deleteTokenAuthorization', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created token client');
    client.deleteTokenAuthorization(newTokenId, function(err) {
      assert.ifError(err, 'token authorization could not be deleted');
      assert.end();
    });
  });

  tokenClient.end();
});
