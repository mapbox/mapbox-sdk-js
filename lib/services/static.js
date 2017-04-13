'use strict';

var invariant = require('../../vendor/invariant'),
  xtend = require('../../vendor/xtend').extend,
  uriTemplate = require('rest/util/uriTemplate'),
  encodeOverlay = require('../encode_overlay'),
  invariantLocation = require('../invariant_location'),
  makeService = require('../make_service'),
  constants = require('../constants');

var MapboxStatic = makeService('MapboxStatic');

/**
 * Determine a URL for a static map image, using the [Mapbox Static Map API](https://www.mapbox.com/api-documentation/#static).
 *
 * @param {string} username
 * @param {string} styleid
 * @param {number} width width of the image
 * @param {number} height height of the image
 *
 * @param {Object|string} position either an object with longitude and latitude members, or the string 'auto'
 * @param {number} position.longitude east, west bearing
 * @param {number} position.latitude north, south bearing
 * @param {number} position.zoom zoom level
 * @param {number} position.bearing
 * @param {number} position.pitch
 *
 * @param {Object} options all map options
 * @param {boolean} [options.retina=false] whether to double image pixel density
 *
 * @param {Array<Object>} [options.markers=[]] an array of simple marker objects as an overlay
 * @param {Object} [options.geojson={}] geojson data for the overlay
 * @param {Object} [options.path={}] a path and
 * @param {Array<Object>} options.path.geojson data for the path as an array of longitude, latitude objects
 * @param {Array<Object>} options.path.style optional style definitions for a path
 * @param {boolean} options.attribution controlling whether there is attribution on the image; defaults to true
 * @param {boolean} options.logo controlling whether there is a Mapbox logo on the image; defaults to true
 * @param {string} options.before_layer value for controlling where the overlay is inserted in the style
 *
 * @returns {string} static map url
 * @memberof MapboxClient
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 */
MapboxStatic.prototype.getStaticURL = function(username, styleid, width, height, position, options) {
  invariant(typeof username === 'string', 'username option required and must be a string');
  invariant(typeof styleid === 'string', 'styleid option required and must be a string');
  invariant(typeof width === 'number', 'width option required and must be a number');
  invariant(typeof height === 'number', 'height option required and must be a number');

  var defaults = {
    retina: ''
  };

  var xyzbp;

  if (position === 'auto') {
    xyzbp = 'auto';
  } else {
    invariantLocation(position);
    xyzbp = position.longitude + ',' + position.latitude + ',' + position.zoom
          + (('bearing' in position) ? ',' + position.bearing : '')
          + (('pitch' in position) ? ',' + position.pitch : '');
  }

  var userOptions = {};

  if (options) {
    invariant(typeof options === 'object', 'options must be an object');
    if (options.format) {
      invariant(typeof options.format === 'string', 'format must be a string');
      userOptions.format = options.format;
    }
    if (options.retina) {
      invariant(typeof options.retina === 'boolean', 'retina must be a boolean');
      userOptions.retina = options.retina;
    }
    if (options.markers) {
      userOptions.overlay = '/' + encodeOverlay.encodeMarkers(options.markers);
    } else if (options.geojson) {
      userOptions.overlay = '/' + encodeOverlay.encodeGeoJSON(options.geojson);
    } else if (options.path) {
      userOptions.overlay = '/' + encodeOverlay.encodePath(options.path);
    }
    if ('attribution' in options) {
      invariant(typeof options.attribution === 'boolean', 'attribution must be a boolean');
      userOptions.attribution = options.attribution;
    }
    if ('logo' in options) {
      invariant(typeof options.logo === 'boolean', 'logo must be a boolean');
      userOptions.logo = options.logo;
    }
    if (options.before_layer) {
      invariant(typeof options.before_layer === 'string', 'before_layer must be a string');
      userOptions.before_layer = options.before_layer;
    }
  }

  var params = xtend(defaults, userOptions, {
    username: username,
    styleid: styleid,
    width: width,
    xyzbp: xyzbp,
    height: height,
    access_token: this.accessToken
  });

  if (params.retina === true) {
    params.retina = '@2x';
  }

  return this.endpoint + uriTemplate.expand(constants.API_STATIC, params);
};

/**
 * Determine a URL for a static classic map image, using the [Mapbox Static (Classic) Map API](https://www.mapbox.com/api-documentation/pages/static_classic.html).
 *
 * @param {string} mapid a Mapbox map id in username.id form
 * @param {number} width width of the image
 * @param {number} height height of the image
 *
 * @param {Object|string} position either an object with longitude and latitude members, or the string 'auto'
 * @param {number} position.longitude east, west bearing
 * @param {number} position.latitude north, south bearing
 * @param {number} position.zoom zoom level
 *
 * @param {Object} options all map options
 * @param {string} [options.format=png] image format. can be jpg70, jpg80, jpg90, png32, png64, png128, png256
 * @param {boolean} [options.retina=false] whether to double image pixel density
 *
 * @param {Array<Object>} [options.markers=[]] an array of simple marker objects as an overlay
 * @param {Object} [options.geojson={}] geojson data for the overlay
 * @param {Object} [options.path={}] a path and
 * @param {Array<Object>} options.path.geojson data for the path as an array of longitude, latitude objects
 * @param {Array<Object>} options.path.style optional style definitions for a path
 *
 * @returns {string} static classic map url
 * @memberof MapboxClient
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 */
MapboxStatic.prototype.getStaticClassicURL = function(mapid, width, height, position, options) {
  invariant(typeof mapid === 'string', 'mapid option required and must be a string');
  invariant(typeof width === 'number', 'width option required and must be a number');
  invariant(typeof height === 'number', 'height option required and must be a number');

  var defaults = {
    format: 'png',
    retina: ''
  };

  var xyz;

  if (position === 'auto') {
    xyz = 'auto';
  } else {
    invariantLocation(position);
    xyz = position.longitude + ',' + position.latitude + ',' + position.zoom;
  }

  var userOptions = {};

  if (options) {
    invariant(typeof options === 'object', 'options must be an object');
    if (options.format) {
      invariant(typeof options.format === 'string', 'format must be a string');
      userOptions.format = options.format;
    }
    if (options.retina) {
      invariant(typeof options.retina === 'boolean', 'retina must be a boolean');
      userOptions.retina = options.retina;
    }
    if (options.markers) {
      userOptions.overlay = '/' + encodeOverlay.encodeMarkers(options.markers);
    } else if (options.geojson) {
      userOptions.overlay = '/' + encodeOverlay.encodeGeoJSON(options.geojson);
    } else if (options.path) {
      userOptions.overlay = '/' + encodeOverlay.encodePath(options.path);
    }
  }

  var params = xtend(defaults, userOptions, {
    mapid: mapid,
    width: width,
    xyz: xyz,
    height: height,
    access_token: this.accessToken
  });

  if (params.retina === true) {
    params.retina = '@2x';
  }

  return this.endpoint + uriTemplate.expand(constants.API_STATIC_CLASSIC, params);
};



module.exports = MapboxStatic;
