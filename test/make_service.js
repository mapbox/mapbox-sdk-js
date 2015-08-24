/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var makeService = require('../lib/make_service');

test('make_service', function(t) {
  t.test('invalid token', function(assert) {
    var TestService = makeService('Test');
    var badToken = 'sk.eyJ1Ijoid29yYmx5IiwiYSI6ImQwNTg3OGU2MWI5NTI5MjIyNmI1YzNhNWE4ZGFlMmFiI12.-47f43O4Cz5-vEd0gXzJ3w';

    assert.throws(function() {
      TestService.thisOne = new TestService(badToken);
    }, 'token must be valid');

    assert.end();
  });

  t.test('no token', function(assert) {
    var TestService = makeService('Test');

    assert.throws(function() {
      TestService.thisOne = new TestService();
    }, 'must provide a token');

    assert.end();
  });

  t.test('bad options', function(assert) {
    var TestService = makeService('Test');
    var validToken = 'pk.eyJ1Ijoid29yYmx5IiwiYSI6ImQzMjFkZWRkN2IzNzc5M2MzZDgyNTIzZTRhM2E5MDE3In0.IIrNhFTaOiW-Ykw_J-yQbg';

    assert.throws(function() {
      TestService.thisOne = new TestService(validToken, 'options');
    }, 'options must be an object');

    assert.throws(function() {
      TestService.thisOne = new TestService(validToken, { endpoint: [] });
    }, 'endpoint must be a string');

    assert.throws(function() {
      TestService.thisOne = new TestService(validToken, { account: [] });
    }, 'account must be a string');

    assert.end();
  });

  t.test('blank options ok', function(assert) {
    var TestService = makeService('Test');
    var validToken = 'pk.eyJ1Ijoid29yYmx5IiwiYSI6ImQzMjFkZWRkN2IzNzc5M2MzZDgyNTIzZTRhM2E5MDE3In0.IIrNhFTaOiW-Ykw_J-yQbg';

    assert.doesNotThrow(function() {
      TestService.thisOne = new TestService(validToken, {});
    }, 'success');

    assert.end();
  });

  t.test('sets endpoint', function(assert) {
    var TestService = makeService('Test');
    var validToken = 'pk.eyJ1Ijoid29yYmx5IiwiYSI6ImQzMjFkZWRkN2IzNzc5M2MzZDgyNTIzZTRhM2E5MDE3In0.IIrNhFTaOiW-Ykw_J-yQbg';
    var service = new TestService(validToken, { endpoint: 'donuts' });
    assert.ok(service);
    // TODO endpoint is no longer exposed
    // assert.equal(service.endpoint, 'donuts', 'success');
    assert.end();
  });

  t.test('sets owner from account option', function(assert) {
    var TestService = makeService('Test');
    var validToken = 'pk.eyJ1Ijoid29yYmx5IiwiYSI6ImQzMjFkZWRkN2IzNzc5M2MzZDgyNTIzZTRhM2E5MDE3In0.IIrNhFTaOiW-Ykw_J-yQbg';
    var service = new TestService(validToken, { account: 'bambam' });
    assert.equal(service.owner, 'bambam', 'success');
    assert.end();
  });

  t.test('sets owner from access token', function(assert) {
    var TestService = makeService('Test');
    var validToken = 'pk.eyJ1Ijoid29yYmx5IiwiYSI6ImQzMjFkZWRkN2IzNzc5M2MzZDgyNTIzZTRhM2E5MDE3In0.IIrNhFTaOiW-Ykw_J-yQbg';
    var service = new TestService(validToken);
    assert.equal(service.owner, 'worbly', 'success');
    assert.end();
  });

  t.end();
});
