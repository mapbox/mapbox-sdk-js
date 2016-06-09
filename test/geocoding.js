/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  geojsonhint = require('geojsonhint'),
  MapboxClient = require('../lib/services/geocoding');

test('MapboxClient#geocodeForward', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.geocodeForward(null);
    }, /query/);
    t.throws(function() {
      client.geocodeForward(1, function() {});
    }, /query/);
    t.throws(function() {
      client.geocodeForward('foo', 1, function() {});
    }, /options/);
    t.throws(function() {
      client.geocodeForward('foo', 1);
    }, /options/);
    t.end();
  });

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward('Chester, New Jersey', function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('input with linebreak', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward('100 6th St\nSan Francisco', function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('autocomplete=false', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward('New York', {
      autocomplete: false
    }, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('dataset option', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward(
      'Chester, New Jersey', { dataset: 'mapbox.places' },
      function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.equal(geojsonhint.hint(results.features[0]).length, 0, 'at least one valid result');
      t.end();
    });
  });

  t.test('dataset option', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward(
      'Chester, New Jersey', { dataset: 'mapbox.places' })
    .then(function(results) {
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.equal(geojsonhint.hint(results.features[0]).length, 0, 'at least one valid result');
      t.end();
    });
  });

  t.test('options.country', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);

    var tester = { client: function(opts) {
      var params = opts.params;
      t.equals(params.country, 'ca', 'country option is set');
      opts.callback();
      return { entity: function() {} };
    }};

    client.geocodeForward.apply(tester, ['Paris', {
      country: 'ca'
    }, function(err) {
      t.ifError(err);
      t.end();
    }]);
  });

  t.test('options.types', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);

    var tester = { client: function(opts) {
      var params = opts.params;
      t.equals(params.types, 'country,region', 'types option is set');
      opts.callback();
      return { entity: function() {} };
    }};

    client.geocodeForward.apply(tester, ['Paris', {
      types: 'country,region'
    }, function(err) {
      t.ifError(err);
      t.end();
    }]);
  });

  t.test('options.dataset', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward('Paris;Lyon;Nice;Nantes', {
      dataset: 'mapbox.places-permanent'
    }, function(err, results) {
      t.ifError(err);
      t.ok(Array.isArray(results), 'results is an array of results');
      results.forEach(function(result, i) {
        t.deepEqual(geojsonhint.hint(result), [], 'result ' + i + ' is valid');
      });
      t.end();
    });
  });

  t.test('options.dataset with array input', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward(['Paris', 'Lyon', 'Nice', 'Nantes'], {
      dataset: 'mapbox.places-permanent'
    }, function(err, results) {
      t.ifError(err);
      t.ok(Array.isArray(results), 'results is an array of results');
      results.forEach(function(result, i) {
        t.deepEqual(geojsonhint.hint(result), [], 'result ' + i + ' is valid');
      });
      t.end();
    });
  });

  t.test('array input without permanent will throw', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.throws(function() {
      client.geocodeForward(['Paris', 'Lyon', 'Nice', 'Nantes'],
        function(err, results) {
      });
    });
    t.end();
  });

  t.test('options.proximity', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward('Paris', {
      proximity: { latitude: 33.6875431, longitude: -95.4431142 }
    }, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('options.proximity rounding', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);

    var tester = { client: function(opts) {
      opts.params.proximity.split(',').forEach(function(coord, i) {
        t.ok(coord.toString().split('.')[1].length <= 3, 'proximity coordinate [' + i + '] precision <= 3');
      });
      t.ok(opts.params.proximity, 'proximity is set');
      opts.callback();
      return { entity: function() {} };
    }};

    t.ok(client);
    client.geocodeForward.apply(tester, ['Paris', {
      proximity: { latitude: 33.6875431, longitude: -95.4431142 }
    }, function(err) {
      t.ifError(err);
      t.end();
    }]);
  });

  t.test('options.proximity rounding, precision = 1', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);

    var tester = { client: function(opts) {
      opts.params.proximity.split(',').forEach(function(coord, i) {
        t.ok(coord.toString().split('.')[1].length <= 1, 'proximity coordinate [' + i + '] precision <= 1');
      });
      t.ok(opts.params.proximity, 'proximity is set');
      opts.callback();
      return { entity: function() {} };
    }};

    t.ok(client);
    client.geocodeForward.apply(tester, ['Paris', {
      proximity: { latitude: 33.6875431, longitude: -95.4431142 },
      precision: 1
    }, function(err) {
      t.ifError(err);
      t.end();
    }]);
  });

  t.test('options.bbox', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);

    var tester = { client: function(opts) {
      var params = opts.params;
      t.equals(params.bbox, '-98,32,-96,34', 'bbox option is set');
      opts.callback();
      return { entity: function() {} };
    }};

    client.geocodeForward.apply(tester, ['Paris', {
      bbox: [-98, 32, -96, 34]
    }, function(err) {
      t.ifError(err);
      t.end();
    }]);
  });

  t.end();
});

test('MapboxClient#geocodeReverse', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.geocodeReverse(null);
    }, /options/, 'null string');
    t.throws(function() {
      client.geocodeReverse(1, function() {});
    }, /location/, 'number');
    t.throws(function() {
      client.geocodeReverse('foo', 1, function() {});
    }, /location/, 'bad options');
    t.throws(function() {
      client.geocodeReverse('foo', 1);
    }, /location/, 'bad options 2');
    t.end();
  });

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeReverse({ latitude: 33.6875431, longitude: -95.4431142 }, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('options.types', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);

    var tester = { client: function(opts) {
      var params = opts.params;
      t.equals(params.types, 'country,region', 'types option is set');
      opts.callback();
      return { entity: function() {} };
    }};

    client.geocodeReverse.apply(tester, [
    { latitude: 33.6875431, longitude: -95.4431142 },
    { types: 'country,region' },
    function(err) {
      t.ifError(err);
      t.end();
    }]);
  });

  t.test('options.dataset', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeReverse(
      { latitude: 33.6875431, longitude: -95.4431142 },
      { dataset: 'mapbox.places' },
      function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('reverse coordinate rounding', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);

    var tester = { client: function(opts) {
      [opts.params.longitude, opts.params.latitude].forEach(function(coord, i) {
        t.ok(coord.toString().split('.')[1].length <= 5, 'reverse coordinate [' + i + '] precision <= 5');
      });
      t.ok(opts.params.longitude, 'longitude is set');
      t.ok(opts.params.latitude, 'latitude is set');
      opts.callback();
      return { entity: function() {} };
    }};

    t.ok(client);
    client.geocodeReverse.apply(tester, [{
      latitude: 33.6875431,
      longitude: -95.4431142
    }, function(err) {
      t.ifError(err);
      t.end();
    }]);
  });

  t.test('reverse coordinate precision = 2', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);

    var tester = { client: function(opts) {
      [opts.params.longitude, opts.params.latitude].forEach(function(coord, i) {
        t.ok(coord.toString().split('.')[1].length <= 2, 'reverse coordinate [' + i + '] precision <= 2');
      });
      t.ok(opts.params.longitude, 'longitude is set');
      t.ok(opts.params.latitude, 'latitude is set');
      opts.callback();
      return { entity: function() {} };
    }};

    t.ok(client);
    client.geocodeReverse.apply(tester, [{
      latitude: 33.6875431,
      longitude: -95.4431142
    }, {
      precision: 2
    }, function(err) {
      t.ifError(err);
      t.end();
    }]);
  });

  t.end();
});
