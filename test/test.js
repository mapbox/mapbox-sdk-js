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

test('MapboxClient', function(t) {
  t.throws(function() {
    var client = new MapboxClient();
    t.notOk(client);
  }, /accessToken required to instantiate MapboxClient/);
  var client = new MapboxClient('token');
  t.ok(client);
  t.equal(client.accessToken, 'token');
  t.end();
});
