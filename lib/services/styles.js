'use strict';

var invariant = require('../../vendor/invariant');
var uriTemplate = require('rest/util/uriTemplate');
var makeService = require('../make_service');

/**
 * @class MapboxStyles
 */
var MapboxStyles = module.exports = makeService('MapboxStyles');

var API_STYLES_LIST = '/styles/v1/{owner}{?access_token}';
var API_STYLES_CREATE = '/styles/v1/{owner}{?access_token}';
var API_STYLES_READ = '/styles/v1/{owner}/{styleid}{?access_token}';
var API_STYLES_UPDATE = '/styles/v1/{owner}/{styleid}{?access_token}';
var API_STYLES_DELETE = '/styles/v1/{owner}/{styleid}{?access_token}';
var API_STYLES_EMBED = '/styles/v1/{owner}/{styleid}.html{?access_token,zoomwheel,title}';
var API_STYLES_SPRITE = '/styles/v1/{owner}/{styleid}/sprite{+retina}{.format}{?access_token}';
var API_STYLES_SPRITE_ICON = '/styles/v1/{owner}/{styleid}/sprite/{iconName}{?access_token}';
var API_STYLES_FONT_GLYPH_RANGES = '/fonts/v1/{owner}/{font}/{start}-{end}.pbf{?access_token}';

/**
 * To retrieve a listing of styles for a particular account.
 *
 * @param {Function} callback called with (err, styles)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listStyles(function(err, styles) {
 *   console.log(styles);
 *   // [{ version: 8,
 *   //  name: 'Light',
 *   //  center: [ -77.0469979435026, 38.898634927602814 ],
 *   //  zoom: 12.511766533145998,
 *   //  bearing: 0,
 *   //  pitch: 0,
 *   //  created: '2016-02-09T14:26:15.059Z',
 *   //  id: 'STYLEID',
 *   //  modified: '2016-02-09T14:28:31.253Z',
 *   //  owner: '{username}' },
 *   //  { version: 8,
 *   //  name: 'Dark',
 *   //  created: '2015-08-28T18:05:22.517Z',
 *   //  id: 'STYILEID',
 *   //  modified: '2015-08-28T18:05:22.517Z',
 *   //  owner: '{username}' }]
 * });
 */
MapboxStyles.prototype.listStyles = function(callback) {
  return this.client({
    path: API_STYLES_LIST,
    params: {
      owner: this.owner
    },
    callback: callback
  });
};

/**
 * Create a style, given the style as a JSON object.
 *
 * @param {Object} style Mapbox GL Style Spec object
 * @param {Function} callback called with (err, createdStyle)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var style = {
 *   'version': 8,
 *   'name': 'My Awesome Style',
 *   'metadata': {},
 *   'sources': {},
 *   'layers': [],
 *   'glyphs': 'mapbox://fonts/{owner}/{fontstack}/{range}.pbf'
 * };
 * client.createStyle(style, function(err, createdStyle) {
 *   console.log(createdStyle);
 * });
 */
MapboxStyles.prototype.createStyle = function(style, callback) {
  return this.client({
    path: API_STYLES_CREATE,
    params: {
      owner: this.owner
    },
    entity: style,
    callback: callback
  });
};

/**
 * Update a style, given the style as a JSON object.
 *
 * @param {Object} style Mapbox GL Style Spec object
 * @param {string} styleid style id
 * @param {Function} callback called with (err, createdStyle)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var style = {
 *   'version': 8,
 *   'name': 'My Awesome Style',
 *   'metadata': {},
 *   'sources': {},
 *   'layers': [],
 *   'glyphs': 'mapbox://fonts/{owner}/{fontstack}/{range}.pbf'
 * };
 * client.updateStyle(style, 'style-id', function(err, createdStyle) {
 *   console.log(createdStyle);
 * });
 */
MapboxStyles.prototype.updateStyle = function(style, styleid, callback) {
  invariant(typeof styleid === 'string', 'style id must be a string');
  return this.client({
    path: API_STYLES_UPDATE,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    entity: style,
    method: 'patch',
    callback: callback
  });
};

/**
 * Deletes a particular style.
 *
 * @param {string} styleid the id for an existing style
 * @param {Function} callback called with (err)
 * @returns {Promise} a promise with the response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteStyle('style-id', function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
MapboxStyles.prototype.deleteStyle = function(styleid, callback) {
  invariant(typeof styleid === 'string', 'styleid must be a string');

  return this.client({
    path: API_STYLES_DELETE,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Reads a particular style.
 *
 * @param {string} styleid the id for an existing style
 * @param {Function} callback called with (err, style)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readStyle('style-id', function(err, style) {
 *   if (!err) console.log(style);
 * });
 */
MapboxStyles.prototype.readStyle = function(styleid, callback) {
  invariant(typeof styleid === 'string', 'styleid must be a string');

  return this.client({
    path: API_STYLES_READ,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    callback: callback
  });
};

/**
 * Read sprite
 *
 * @param {string} styleid the id for an existing style
 * @param {Object=} options optional options
 * @param {boolean} options.retina whether the sprite JSON should be for a
 * retina sprite.
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readSprite('style-id', {
 *   retina: true
 * }, function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
MapboxStyles.prototype.readSprite = function(styleid, options, callback) {
  invariant(typeof styleid === 'string', 'styleid must be a string');

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var retina = '';
  if (options.retina) {
    invariant(typeof options.retina === 'boolean',
      'retina option must be a boolean value');
    if (options.retina) {
      retina = '@2x';
    }
  }

  var format = 'json';
  if (options.format) {
    invariant(options.format === 'json' ||
      options.format === 'png',
      'format parameter must be either json or png');
    format = options.format;
  }

  return this.client({
    path: API_STYLES_SPRITE,
    params: {
      owner: this.owner,
      retina: retina,
      format: format,
      styleid: styleid
    },
    callback: callback
  });
};

/**
 * Get font glyph ranges
 *
 * @param {string} font or fonts
 * @param {number} start character code of starting glyph
 * @param {number} end character code of last glyph. typically the same
 * as start + 255
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readFontGlyphRanges('Arial Unicode', 0, 255, function(err, ranges) {
 *   if (!err) console.log(ranges);
 * });
 */
MapboxStyles.prototype.readFontGlyphRanges = function(font, start, end, callback) {
  invariant(typeof font === 'string', 'font must be a string');
  invariant(typeof start === 'number', 'start must be a number');
  invariant(typeof end === 'number', 'end must be a number');

  return this.client({
    path: API_STYLES_FONT_GLYPH_RANGES,
    params: {
      owner: this.owner,
      font: font,
      start: start,
      end: end
    },
    callback: callback
  });
};

/**
 * Add an icon to a sprite.
 *
 * @param {string} styleid the id for an existing style
 * @param {string} iconName icon's name
 * @param {Buffer} icon icon content as a buffer
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var fs = require('fs');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.addIcon('style-id', 'icon-name', fs.readFileSync('icon.png'), function(err) {
 *   if (!err) console.log('added icon!');
 * });
 */
MapboxStyles.prototype.addIcon = function(styleid, iconName, icon, callback) {
  invariant(typeof styleid === 'string', 'style must be a string');
  invariant(typeof iconName === 'string', 'icon name must be a string');
  invariant(Buffer.isBuffer(icon), 'icon must be a Buffer');

  return this.client({
    path: API_STYLES_SPRITE_ICON,
    params: {
      owner: this.owner,
      styleid: styleid,
      iconName: iconName
    },
    headers: {
      'Content-Type': 'text/plain'
    },
    entity: icon,
    method: 'put',
    callback: callback
  });
};

/**
 * Delete an icon from a sprite.
 *
 * @param {string} styleid the id for an existing style
 * @param {string} iconName icon's name
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteIcon('style-id', 'icon-name', function(err) {
 *   if (!err) console.log('deleted icon!');
 * });
 */
MapboxStyles.prototype.deleteIcon = function(styleid, iconName, callback) {
  invariant(typeof styleid === 'string', 'style must be a string');
  invariant(typeof iconName === 'string', 'icon name must be a string');

  return this.client({
    path: API_STYLES_SPRITE_ICON,
    params: {
      owner: this.owner,
      styleid: styleid,
      iconName: iconName
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Embed a style.
 *
 * @param {string} styleid the id for an existing style
 * @param {Object} options optional params
 * @param {boolean} [options.title=false] If true, shows a title box in upper right
 * corner with map title and owner
 * @param {boolean} [options.zoomwheel=true] Disables zooming with mouse scroll wheel
 * @returns {string} URL of style embed page
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var url = client.embedStyle('style-id');
 */
MapboxStyles.prototype.embedStyle = function(styleid, options) {
  invariant(typeof styleid === 'string', 'style must be a string');

  var params = {
    styleid: styleid,
    access_token: this.accessToken,
    owner: this.owner,
    title: false,
    zoomwheel: true
  };

  if (options) {
    if (options.title !== undefined) {
      invariant(typeof options.title === 'boolean', 'title must be a boolean');
      params.title = options.title;
    }
    if (options.zoomwheel !== undefined) {
      invariant(typeof options.zoomwheel === 'boolean', 'zoomwheel must be a boolean');
      params.zoomwheel = options.zoomwheel;
    }
  }

  return this.endpoint + uriTemplate.expand(API_STYLES_EMBED, params);
};
