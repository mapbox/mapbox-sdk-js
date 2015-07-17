'use strict';

var assert = require('assert'),
  resolveToString = require('es6-template-strings/resolve-to-string'),
  geojsonhint = require('geojsonhint'),
  qs = require('querystring'),
  request = require('superagent'),
  constants = require('./constants');

function formatPoints(waypoints) {
  return waypoints.map(function(location) {
    assert(typeof location.latitude === 'number' &&
      typeof location.longitude === 'number',
      'location must be an object with numeric latitude & longitude properties');
    return location.longitude + ',' + location.latitude;
  }).join(';');
}

/**
 * The JavaScript API to Mapbox services
 *
 * @class
 * @throws {Error} if accessToken is not provided
 * @param {string} accessToken a private or public access token
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 */
function MapboxClient(accessToken) {
  assert(typeof accessToken === 'string',
    'accessToken required to instantiate MapboxClient');
  this.accessToken = accessToken;
}

MapboxClient.prototype.q = function(options) {
  options.access_token = this.accessToken;
  return '?' + qs.stringify(options);
};

/**
 * Search for a location with a string, using the
 * [Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/).
 *
 * @param {string} query desired location
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {Object} options.proximity a proximity argument: this is
 * a geographical point given as an object with latitude and longitude
 * properties. Search results closer to this point will be given
 * higher priority.
 * @param {string} [options.dataset=mapbox.places] the desired data to be
 * geocoded against. The default, mapbox.places, does not permit unlimited
 * caching. `mapbox.places-permanent` is available on request and does
 * permit permanent caching.
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocodeForward('Paris, France', function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 * // using the proximity option to weight results closer to texas
 * mapboxClient.geocodeForward('Paris, France', {
 *   proximity: { latitude: 33.6875431, longitude: -95.4431142 }
 * }, function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 */
MapboxClient.prototype.geocodeForward = function(query, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  assert(typeof query === 'string', 'query must be a string');
  assert(typeof options === 'object', 'options must be an object');
  assert(typeof callback === 'function', 'callback must be a function');

  var queryOptions = {};
  if (options.proximity) {
    assert(typeof options.proximity.latitude === 'number' &&
      typeof options.proximity.longitude === 'number',
      'proximity must be an object with numeric latitude & longitude properties');
    queryOptions.proximity = options.proximity.longitude + ',' + options.proximity.latitude;
  }

  var dataset = 'mapbox.places';
  if (options.dataset) {
    assert(typeof options.dataset === 'string', 'dataset option must be string');
    dataset = options.dataset;
  }

  var url = resolveToString(constants.API_GEOCODER_FORWARD, {
    query: query,
    dataset: dataset
  }) + this.q(queryOptions);

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

/**
 * Given a location, determine what geographical features are located
 * there. This uses the [Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/).
 *
 * @param {Object} location the geographical point to search
 * @param {number} location.latitude decimal degrees latitude, in range -90 to 90
 * @param {number} location.longitude decimal degrees longitude, in range -180 to 180
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.dataset=mapbox.places] the desired data to be
 * geocoded against. The default, mapbox.places, does not permit unlimited
 * caching. `mapbox.places-permanent` is available on request and does
 * permit permanent caching.
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocodeReverse(
 *   { latitude: 33.6875431, longitude: -95.4431142 },
 *   function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 */
MapboxClient.prototype.geocodeReverse = function(location, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  assert(typeof location === 'object', 'location must be an object');
  assert(typeof options === 'object', 'options must be an object');
  assert(typeof callback === 'function', 'callback must be a function');

  assert(typeof location.latitude === 'number' &&
    typeof location.longitude === 'number',
    'location must be an object with numeric latitude & longitude properties');

  var dataset = 'mapbox.places';
  if (options.dataset) {
    assert(typeof options.dataset === 'string', 'dataset option must be string');
    dataset = options.dataset;
  }

  var url = resolveToString(constants.API_GEOCODER_REVERSE, {
    location: location,
    dataset: dataset
  }) + this.q({});

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

/**
 * Find directions from A to B, or between any number of locations.
 * Consult the [Mapbox Directions API](https://www.mapbox.com/developers/api/directions/)
 * for more documentation.
 *
 * @param {Array<Object>} waypoints an array of objects with `latitude`
 * and `longitude` properties that represent waypoints in order. Up to
 * 25 waypoints can be specified.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=mapbox.driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'mapbox.driving'`, which assumes transportation via an
 * automobile and will use highways, `'mapbox.walking'`, which avoids
 * streets without sidewalks, and `'mapbox.cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle.
 * @param {string} [options.alternatives=true] whether to generate
 * alternative routes along with the preferred route.
 * @param {string} [options.instructions=text] format for turn-by-turn
 * instructions along the route.
 * @param {string} [options.geometry=geojson] format for the returned
 * route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline`
 * yields more compact responses which can be decoded on the client side.
 * [GeoJSON](http://geojson.org/), the default, is compatible with libraries
 * like [Mapbox GL](https://www.mapbox.com/mapbox-gl/),
 * Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false`
 * omits the geometry entirely and only returns instructions.
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.directions(
 *   [
 *     { latitude: 33.6, longitude: -95.4431 },
 *     { latitude: 33.2, longitude: -95.4431 } ],
 *   function(err, res) {
 *   // res is a document with directions
 * });
 *
 * // With options
 * mapboxClient.getDirections([
 *   { latitude: 33.6875431, longitude: -95.4431142 },
 *   { latitude: 33.6875431, longitude: -95.4831142 }
 * ], {
 *   profile: 'mapbox.walking',
 *   instructions: 'html',
 *   alternatives: false,
 *   geometry: 'polyline'
 * }, function(err, results) {
 *   console.log(results.origin);
 * });
 */
MapboxClient.prototype.getDirections = function(waypoints, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  assert(Array.isArray(waypoints), 'waypoints must be an array');
  assert(typeof options === 'object', 'options must be an object');
  assert(typeof callback === 'function', 'callback must be a function');

  var encodedWaypoints = formatPoints(waypoints);

  var profile = 'mapbox.driving',
    alternatives = true,
    geometry = 'geojson',
    instructions = 'text';

  if (options.profile) {
    assert(typeof options.profile === 'string', 'profile option must be string');
    profile = options.profile;
  }

  if (options.instructions) {
    assert(typeof options.instructions === 'string', 'instructions option must be string');
    instructions = options.instructions;
  }

  if (options.geometry) {
    assert(typeof options.geometry === 'string', 'geometry option must be string');
    geometry = options.geometry;
  }

  var url = resolveToString(constants.API_DIRECTIONS, {
    encodedWaypoints: encodedWaypoints,
    profile: profile
  }) + this.q({
    instructions: instructions,
    geometry: geometry,
    alternatives: alternatives
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

/**
 * Snap recorded location traces to roads and paths from OpenStreetMap.
 * Consult the [Map Matching API](https://www.mapbox.com/developers/api/map-matching/)
 * for more documentation.
 *
 * @param {Object} trace a single [GeoJSON](http://geojson.org/)
 * Feature with a LineString geometry, containing up to 100 positions.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=mapbox.driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'mapbox.driving'`, which assumes transportation via an
 * automobile and will use highways, `'mapbox.walking'`, which avoids
 * streets without sidewalks, and `'mapbox.cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle.
 * @param {string} [options.geometry=geojson] format for the returned
 * route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline`
 * yields more compact responses which can be decoded on the client side.
 * [GeoJSON](http://geojson.org/), the default, is compatible with libraries
 * like [Mapbox GL](https://www.mapbox.com/mapbox-gl/),
 * Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false`
 * omits the geometry entirely and only returns matched points.
 * @param {number} [options.gps_precision=4] An integer in meters indicating
 * the assumed precision of the used tracking device. Use higher
 * numbers (5-10) for noisy traces and lower numbers (1-3) for clean
 * traces. The default value is 4.
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.matching({
 *   "type": "Feature",
 *   "properties": {
 *     "coordTimes": [
 *       "2015-04-21T06:00:00Z",
 *       "2015-04-21T06:00:05Z",
 *       "2015-04-21T06:00:10Z",
 *       "2015-04-21T06:00:15Z",
 *       "2015-04-21T06:00:20Z"
 *     ]
 *     },
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [ 13.418946862220764, 52.50055852688439 ],
 *       [ 13.419011235237122, 52.50113000479732 ],
 *       [ 13.419756889343262, 52.50171780290061 ],
 *       [ 13.419885635375975, 52.50237416816131 ],
 *       [ 13.420631289482117, 52.50294888790448 ]
 *     ]
 *   }
 * },
 *   function(err, res) {
 *   // res is a document with directions
 * });
 */
MapboxClient.prototype.matching = function(trace, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  assert(geojsonhint.hint(trace).length === 0, 'trace must be valid GeoJSON');
  assert(typeof options === 'object', 'options must be an object');
  assert(typeof callback === 'function', 'callback must be a function');

  var profile = 'mapbox.driving',
    gps_precision = 4,
    geometry = 'geojson';


  if (options.gps_precision !== undefined) {
    assert(typeof options.gps_precision === 'number', 'gps_precision must be a number');
    gps_precision = options.gps_precision;
  }

  if (options.profile) {
    assert(typeof options.profile === 'string', 'profile option must be string');
    profile = options.profile;
  }

  if (options.geometry) {
    assert(typeof options.geometry === 'string', 'geometry option must be string');
    geometry = options.geometry;
  }

  var url = resolveToString(constants.API_MATCHING, {
    profile: profile
  }) + this.q({
    geometry: geometry,
    gps_precision: gps_precision
  });

  request.post(url)
    .send(trace)
    .end(function(err, res) {
      callback(err, res.body);
    });
};

/**
 * Given a list of locations, retrieve vector tiles, find the nearest
 * spatial features, extract their data values, and then absolute values and
 * optionally interpolated values in-between, if the interpolate option is specified.
 *
 * Consult the [Surface API](https://www.mapbox.com/developers/api/surface/)
 * for more documentation.
 *
 * @param {string} mapid a Mapbox mapid containing vector tiles against
 * which we'll query
 * @param {string} layer layer within the given `mapid` for which to pull
 * data
 * @param {Array<string>} fields layer within the given `mapid` for which to pull
 * data
 * @param {Array<Object>|string} path either an encoded polyline,
 * provided as a string, or an array of objects with longitude and latitude
 * properties, similar to waypoints.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.geojson=false] whether to return data as a
 * GeoJSON point
 * @param {string} [options.zoom=maximum] zoom level at which features
 * are queried
 * @param {boolean} [options.interpolate=true] Whether to interpolate
 * between matches in the feature collection.
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 */
MapboxClient.prototype.surface = function(mapid, layer, fields, path, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  assert(typeof mapid === 'string', 'mapid must be a string');
  assert(typeof layer === 'string', 'layer must be a string');
  assert(Array.isArray(fields), 'fields must be an array of strings');
  assert(Array.isArray(path) || typeof path === 'string', 'path must be an array of objects or a string');
  assert(typeof options === 'object', 'options must be an object');
  assert(typeof callback === 'function', 'callback must be a function');

  var interpolate = true,
    geojson = false;

  if (options.interpolate !== undefined) {
    assert(typeof options.interpolate === 'boolean', 'interpolate must be a boolean');
    interpolate = options.interpolate;
  }

  if (options.geojson !== undefined) {
    assert(typeof options.geojson === 'boolean', 'geojson option must be boolean');
    geojson = options.geojson;
  }

  var surfaceOptions = {
    geojson: geojson,
    layer: layer,
    fields: fields.join(','),
    interpolate: interpolate
  };

  if (Array.isArray(path)) {
    surfaceOptions.points = formatPoints(path);
  } else {
    surfaceOptions.encoded_polyline = path;
  }

  if (options.zoom !== undefined) {
    assert(typeof options.zoom === 'number', 'zoom must be a number');
    surfaceOptions.z = options.zoom;
  }

  var url = resolveToString(constants.API_SURFACE, {
    mapid: mapid
  }) + this.q(surfaceOptions);

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

module.exports = MapboxClient;
