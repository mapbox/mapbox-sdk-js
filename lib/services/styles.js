'use strict';

var invariant = require('../../vendor/invariant'),
  hat = require('../../vendor/hat'),
  uriTemplate = require('rest/util/uriTemplate'),
  makeService = require('../make_service'),
  constants = require('../constants');

var Styles = module.exports = makeService('MapboxStyles');

/**
 * To retrieve a listing of styles for a particular account.
 *
 * @param {Function} callback called with (err, datasets)
 * @returns {undefined} nothing, calls callback
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listStyles(function(err, styles) {
 *   console.log(datasets);
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
Styles.prototype.listStyles = function(callback) {
  return this.client({
    path: constants.API_STYLES_LIST,
    params: {
      owner: this.owner
    },
    callback: callback
  }).entity();
};

/**
 * Create a style, given the style as a JSON object.
 *
 * @param {Object} style Mapbox GL Style Spec object
 * @param {Function} callback called with (err, datasets)
 * @returns {undefined} nothing, calls callback
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
Styles.prototype.createStyle = function(style, callback) {
  return this.client({
    path: constants.API_STYLES_CREATE,
    params: {
      owner: this.owner
    },
    entity: style,
    callback: callback
  }).entity();
};

/**
 * Update a style, given the style as a JSON object.
 *
 * @param {Object} style Mapbox GL Style Spec object
 * @param {string} id style id
 * @param {Function} callback called with (err, datasets)
 * @returns {undefined} nothing, calls callback
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
Styles.prototype.updateStyle = function(style, styleid, callback) {
  invariant(typeof styleid === 'string', 'style id must be a string');
  return this.client({
    path: constants.API_STYLES_UPDATE,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    entity: style,
    method: 'patch',
    callback: callback
  }).entity();
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
 * client.readStyle('style-id', function(err, response) {
 *   if (!err) console.log(response);
 * });
 */
Styles.prototype.deleteStyle = function(styleid, callback) {
  invariant(typeof styleid === 'string', 'styleid must be a string');

  return this.client({
    path: constants.API_STYLES_DELETE,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    method: 'delete',
    callback: callback
  }).entity();
};

/**
 * Reads a particular style.
 *
 * @param {string} styleid the id for an existing style
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteStyle('style-id', function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
Styles.prototype.readStyle = function(styleid, callback) {
  invariant(typeof styleid === 'string', 'styleid must be a string');

  return this.client({
    path: constants.API_STYLES_READ,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    callback: callback
  }).entity();
};

/**
 * Read sprite
 *
 * @param {string} styleid the id for an existing style
 * @param {Object=} options optional options
 * @param {boolean} options.retina whether the sprite JSON should be for a
 * retina sprite.
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readSprite('style-id', {
 *   retina: true
 * }, function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
Styles.prototype.readSprite = function(styleid, options, callback) {
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
    path: constants.API_STYLES_SPRITE,
    params: {
      owner: this.owner,
      retina: retina,
      format: format,
      styleid: styleid
    },
    callback: callback
  }).entity();
};

/**
 * Get font glyph ranges
 *
 * @param {string} font or fonts
 * @param {number} start character code of starting glyph
 * @param {number} end character code of last glyph. typically the same
 * as start + 255
 * @param {Function} callback called with (err)
 * @returns {Promise}
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readFontGlyphRanges('Arial Unicode', 0, 255, function(err, ranges) {
 *   if (!err) console.log(ranges);
 * });
 */
Styles.prototype.readFontGlyphRanges = function(font, start, end, callback) {
  invariant(typeof font === 'string', 'font must be a string');
  invariant(typeof start === 'number', 'start must be a number');
  invariant(typeof end === 'number', 'end must be a number');

  return this.client({
    path: constants.API_STYLES_FONT_GLYPH_RANGES,
    params: {
      owner: this.owner,
      font: font,
      start: start,
      end: end
    },
    callback: callback
  }).entity();
};

/**
 * Add an icon to a sprite.
 *
 * @param {string} style the id for an existing style
 * @param {string} iconName icon's name
 * @param {Buffer} icon icon content as a buffer
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 * @example
 * var MapboxClient = require('mapbox');
 * var fs = require('fs');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.addIcon('style-id', 'icon-name', fs.readFileSync('icon.png'), function(err) {
 *   if (!err) console.log('added icon!');
 * });
 */
Styles.prototype.addIcon = function(styleid, iconName, icon, callback) {
  invariant(typeof styleid === 'string', 'style must be a string');
  invariant(typeof iconName === 'string', 'icon name must be a string');
  invariant(Buffer.isBuffer(icon), 'icon must be a Buffer');

  return this.client({
    path: constants.API_STYLES_SPRITE_ADD_ICON,
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
  }).entity();
};

/**
 * Delete an icon from a sprite.
 *
 * @param {string} style the id for an existing style
 * @param {string} iconName icon's name
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteIcon('style-id', 'icon-name', function(err) {
 *   if (!err) console.log('deleted icon!');
 * });
 */
Styles.prototype.deleteIcon = function(styleid, iconName, callback) {
  invariant(typeof styleid === 'string', 'style must be a string');
  invariant(typeof iconName === 'string', 'icon name must be a string');

  return this.client({
    path: constants.API_STYLES_SPRITE_ADD_ICON,
    params: {
      owner: this.owner,
      styleid: styleid,
      iconName: iconName
    },
    method: 'delete',
    callback: callback
  }).entity();
};

/**
 * Embed a style.
 *
 * @param {string} style the id for an existing style
 * @param {Object} options
 * @param {boolean=false} options.title If true, shows a title box in upper right
 * corner with map title and owner 
 * @param {boolean=true} options.zoomwheel Disables zooming with mouse scroll wheel
 * @returns {string} URL of style embed page
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var url = client.embedStyle('style-id');
 */
Styles.prototype.embedStyle = function(styleid, options) {
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

  return this.endpoint + uriTemplate.expand(constants.API_STYLES_EMBED, params);
};
