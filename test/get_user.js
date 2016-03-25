/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var MapboxClient = require('../');
var getUser = require('../lib/get_user');

test('getUser', function(t) {
  t.test('public token', function(assert) {
    var token = 'pk.eyJ1Ijoid29yYmx5IiwiYSI6ImQzMjFkZWRkN2IzNzc5M2MzZDgyNTIzZTRhM2E5MDE3In0.IIrNhFTaOiW-Ykw_J-yQbg';
    assert.equal(getUser(token), 'worbly', 'success');
    assert.end();
  });

  t.test('secret token', function(assert) {
    var token = 'sk.eyJ1Ijoid29yYmx5IiwiYSI6ImQwNTg3OGU2MWI5NTI5MjIyNmI1YzNhNWE4ZGFlMmFiIn0.-47f43O4Cz5-vEd0gXzJ3w';
    assert.equal(getUser(token), 'worbly', 'success');
    assert.end();
  });

  t.test('token padding', function(assert) {
    var token = 'sk.eyJ1Ijoid29yYmx5IiwiYSI6ImQwNTg3OGU2MWI5NTI5MjIyNmI1YzNhNWE4ZGFlMmFiIn0=.-47f43O4Cz5-vEd0gXzJ3w';
    assert.equal(getUser(token), 'worbly', 'success');
    assert.end();
  });

  t.test('from client static method', function(assert) {
    var token = 'sk.eyJ1Ijoid29yYmx5IiwiYSI6ImQwNTg3OGU2MWI5NTI5MjIyNmI1YzNhNWE4ZGFlMmFiIn0=.-47f43O4Cz5-vEd0gXzJ3w';
    assert.equal(MapboxClient.getUser(token), 'worbly', 'success');
    assert.end();
  });

  t.test('bogus token', function(assert) {
    var token = 'sk.eyJ1Ijoid29yYmx5IiwiYSI6ImQwNTg3OGU2MWI5NTI5MjIyNmI1YzNhNWE4ZGFlMmFiI12.-47f43O4Cz5-vEd0gXzJ3w';
    assert.notOk(getUser(token), 'cannot parse success');
    token = 'notvalidatall';
    assert.notOk(getUser(token), 'not correctly structured');
    assert.end();
  });

  t.end();
});
