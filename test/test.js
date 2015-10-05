/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  // fs = require('fs'),
  // path = require('path'),
  MapboxClient = require('../');

// function storedFixture(t, value, name) {
//   var fixturePath = path.join(__dirname, 'fixtures', name);
//   if (process.env.UPDATE) {
//     fs.writeFileSync(fixturePath, JSON.stringify(value, null, 2));
//   }
//   t.deepEqual(value, JSON.parse(fs.readFileSync(fixturePath)), name);
// }

test('prerequisites', function(t) {
  t.ok(process.env.MapboxAccessToken, 'mapbox access token is provided');
  t.end();
});

var deadToken = 'pk.eyJ1Ijoid29yYmx5IiwiYSI6ImQzMjFkZWRkN2IzNzc5M2MzZDgyNTIzZTRhM2E5MDE3In0.IIrNhFTaOiW-Ykw_J-yQbg';

test('MapboxClient', function(t) {
  t.throws(function() {
    var client = new MapboxClient();
    t.notOk(client);
  }, /accessToken required to instantiate Mapbox client/);
  var client = new MapboxClient(deadToken);
  t.ok(client);
  // TODO accessToken is no longer exposed
  // t.equal(client.accessToken, deadToken);
  t.end();
});

test('MapboxClient - custom endpoint', function(t) {
  t.throws(function() {
    var client = new MapboxClient(deadToken, 1);
    t.notOk(client);
  }, /options/);
  t.throws(function() {
    var client = new MapboxClient(deadToken, { endpoint: 1 });
    t.notOk(client);
  }, /endpoint/);
  var customClient = new MapboxClient(deadToken, { endpoint: 'foo.bar' });
  // TODO endpoint is no longer exposed
  // t.equal(customClient.endpoint, 'foo.bar', 'receives an endpoint from options');
  t.end();
});
