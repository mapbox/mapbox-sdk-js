/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test;
var fs = require('fs');
var path = require('path');
var MapboxClient = require('../lib/services/styles');
var hat = require('../vendor/hat');

var newStyleFixture = {
  'version': 8,
  'name': 'MAPBOX_SDK_TEST_STYLE_DELETEME',
  'metadata': {},
  'sources': {},
  'layers': [],
  'glyphs': 'mapbox://fonts/{owner}/{fontstack}/{range}.pbf'
};

function removeToken(url) {
  return url.replace(/(\?|&)access_token.*$/, '');
}

test('StyleClient', function(styleClient) {

  if (process.browser) {
    styleClient.pass('skipping style api in browser');
    return styleClient.end();
  }


  /*
  styleClient.test('cleanup old test styles', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created style client');
    client.listStyles(function(err, styles) {
      assert.ifError(err, 'success');
      styles.filter(function(style) {
        return style.name = newStyleFixture.name;
      }).forEach(function(style) {
        assert.test('delete old style', function(deleteRequest) {
          client.deleteStyle(style.id, function(err, res) {
            deleteRequest.ifError(err);
            deleteRequest.end();
          });
        });
      });
      assert.end();
    });
  });
  */

  styleClient.test('#listStyles', function(listStyles) {

    listStyles.test('simple list', function(assert) {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created style client');
      client.listStyles(function(err, styles) {
        assert.ifError(err, 'success');
        assert.ok(Array.isArray(styles), 'lists styles');
        styles.forEach(function(style) {
          assert.ok(style.id, 'Each style has an id');
        });
        assert.end();
      });
    });

    listStyles.end();
  });

  var newStyleId = '';

  styleClient.test('#createStyle', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created style client');
    newStyleFixture.glyphs = newStyleFixture.glyphs
      .replace('{owner}', client.owner);
    client.createStyle(newStyleFixture, function(err, style) {
      assert.ifError(err, 'success');
      assert.ok(style.id, 'returned style has a valid id');
      newStyleId = style.id;
      assert.end();
    });
  });

  // unfortunate workaround for cross-region replication
  styleClient.test('#retrieveStyle', function(assert) {
    setTimeout(function() {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created style client');
      client.readStyle(newStyleId, function(err, style) {
        assert.ifError(err, 'success');
        assert.ok(style.id, 'returned style has a valid id');
        assert.end();
      });
    }, 1000);
  });

  styleClient.test('#readSprite - json', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created style client');
    client.readSprite(newStyleId, function(err, sprite) {
      assert.ifError(err, 'sprite could be seen');
      assert.deepEqual(sprite, {}, 'sprite is an empty object');
      assert.end();
    });
  });

  styleClient.test('#readSprite - json + retina', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created style client');
    client.readSprite(newStyleId, { retina: true }, function(err, sprite) {
      assert.ifError(err, 'sprite could be seen');
      assert.deepEqual(sprite, {}, 'sprite is an empty object');
      assert.end();
    });
  });

  styleClient.test('#readFontGlyphRanges', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created style client');
    client.readFontGlyphRanges('Arial Unicode MS Regular', 0, 255, function(err, ranges) {
      assert.ifError(err, 'sprite could be seen');
      assert.equal(typeof ranges, 'string');
      assert.end();
    });
  });

  styleClient.test('#embedStyle', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created style client');
    assert.equal(removeToken(client.embedStyle('f00')),
      'https://api.mapbox.com/styles/v1/' + client.owner + '/f00.html?zoomwheel=true&title=false');
    assert.equal(removeToken(client.embedStyle('f00', {
      zoomwheel: false, title: true
    })), 'https://api.mapbox.com/styles/v1/' + client.owner + '/f00.html?zoomwheel=false&title=true');
    assert.end();
  });

  styleClient.test('#readSprite - png', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created style client');
    client.readSprite(newStyleId, {
      format: 'png'
    }, function(err, sprite) {
      assert.ifError(err, 'sprite could be seen');
      assert.equal(typeof sprite, 'string', 'sprite is a png');
      assert.end();
    });
  });

  styleClient.test('#addIcon', function(assert) {
    var imageBuffer = fs.readFileSync(path.join(__dirname, 'fixtures/airport-12.svg'));
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created style client');
    client.addIcon(newStyleId, 'aerialway', imageBuffer, function(err, sprite) {
      assert.deepEqual(sprite, {
        aerialway: {
          width: 12,
          height: 12,
          x: 0,
          y: 0,
          pixelRatio: 1
        }
      }, 'sprite is reflected in the response');
      assert.ifError(err, 'icon has been added');
      assert.end();
    });
  });

  styleClient.test('#deleteIcon', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created style client');
    client.deleteIcon(newStyleId, 'aerialway', function(err) {
      assert.ifError(err, 'icon has been deleted');
      assert.end();
    });
  });

  styleClient.test('#updateStyle', function(assert) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    assert.ok(client, 'created style client');
    newStyleFixture.glyphs = newStyleFixture.glyphs
      .replace('{owner}', client.owner);
    newStyleFixture.id = newStyleId;
    client.updateStyle(newStyleFixture, newStyleId, function(err, style) {
      assert.ifError(err, 'success');
      assert.ok(style.id, 'returned style has a valid id');
      assert.end();
    });
  });

  // we've waited for replication in the last step, so this can run
  // safely, immediately
  styleClient.test('#deleteStyle', function(assert) {
    setTimeout(function() {
      var client = new MapboxClient(process.env.MapboxAccessToken);
      assert.ok(client, 'created style client');
      client.deleteStyle(newStyleId, function(err, style) {
        assert.ifError(err, 'item deleted');
        assert.end();
      });
    }, 1000);
  });

  styleClient.end();
});
