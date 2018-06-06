'use strict';

var xtend = require('xtend');
var v = require('./service-helpers/validator');
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Styles API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://www.mapbox.com/api-documentation/#styles).
 */
var Styles = {};

/**
 * Get a style.
 *
 * See the [corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/#retrieve-a-style).
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.getStyle = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId/:styleId',
    params: config
  });
};

/**
 * Create a style.
 *
 * See the [corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/#create-a-style).
 *
 * @param {Object} config
 * @param {Object} config.style - Stylesheet JSON object.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.createStyle = function(config) {
  v.assertShape({
    style: v.plainObject,
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/styles/v1/:ownerId',
    params: pick(config, ['ownerId']),
    body: config.style
  });
};

/**
 * Update a style.
 *
 * See the [corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/#update-a-style).
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {Object} config.style - Stylesheet JSON object.
 * @param {string | number | Date} [config.lastKnownModification] - Datetime of last
 *   known update. Passed as 'If-Unmodified-Since' HTTP header.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.updateStyle = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    style: v.required(v.plainObject),
    lastKnownModification: v.date,
    ownerId: v.string
  })(config);

  var headers = {};
  if (config.lastKnownModification) {
    headers['If-Unmodified-Since'] = new Date(
      config.lastKnownModification
    ).toUTCString();
  }
  return this.client.createRequest({
    method: 'PATCH',
    path: '/styles/v1/:ownerId/:styleId',
    params: pick(config, ['styleId', 'ownerId']),
    headers: headers,
    body: config.style
  });
};

/**
 * Delete a style.
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.deleteStyle = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/styles/v1/:ownerId/:styleId',
    params: config
  });
};

/**
 * List styles in your account.
 *
 * @param {Object} [config]
 * @param {string} [config.start] - The style ID to start at, for paginated results.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.listStyles = function(config) {
  config = config || {};
  v.assertShape({
    start: v.string,
    ownerId: v.string
  })(config);

  var query = {};
  if (config.start) {
    query.start = config.start;
  }
  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId',
    params: pick(config, ['ownerId']),
    query: query
  });
};

/**
 * Add an icon to a style, or update an existing one.
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {string} config.iconId
 * @param {UploadableFile} config.file - An SVG file.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.putStyleIcon = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    iconId: v.required(v.string),
    file: v.file,
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'PUT',
    path: '/styles/v1/:ownerId/:styleId/sprite/:iconId',
    params: pick(config, ['ownerId', 'styleId', 'iconId']),
    file: config.file
  });
};

/**
 * Remove an icon from a style.
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {string} config.iconId
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.deleteStyleIcon = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    iconId: v.required(v.string),
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/styles/v1/:ownerId/:styleId/sprite/:iconId',
    params: config
  });
};

/**
 * Get a style sprite's image or JSON document.
 *
 * See [the corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/?language=JavaScript#retrieve-a-sprite-image-or-json).
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {'json' | 'png'} [config.format="json"]
 * @param {boolean} [config.highRes] - If true, returns spritesheet with 2x
 *   resolution.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.getStyleSprite = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    format: v.oneOf('json', 'png'),
    highRes: v.boolean,
    ownerId: v.string
  })(config);

  var format = config.format || 'json';
  var fileName = 'sprite' + (config.highRes ? '@2x' : '') + '.' + format;

  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId/:styleId/:fileName',
    params: xtend(pick(config, ['ownerId', 'styleId']), {
      fileName: fileName
    })
  });
};

/**
 * Get a font glyph range.
 *
 * See [the corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/?language=JavaScript#retrieve-font-glyph-ranges).
 *
 * @param {Object} config
 * @param {string|Array<string>} config.fonts - An array of font names.
 * @param {number} config.start - Character code of the starting glyph.
 * @param {number} config.end - Character code of the last glyph,
 *   typically equivalent to`config.start + 255`.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.getFontGlyphRange = function(config) {
  v.assertShape({
    fonts: v.required(v.oneOfType(v.string, v.arrayOf(v.string))),
    start: v.required(v.number),
    end: v.required(v.number),
    ownerId: v.string
  })(config);

  var fileName = config.start + '-' + config.end + '.pbf';

  return this.client.createRequest({
    method: 'GET',
    path: '/fonts/v1/:ownerId/:fontList/:fileName',
    params: xtend(pick(config, ['ownerId']), {
      fontList: [].concat(config.fonts),
      fileName: fileName
    })
  });
};

/**
 * Get embeddable HTML displaying a map.
 *
 * See [the corresponding HTTP service documentation](https://www.mapbox.com/api-documentation/?language=JavaScript#embed-a-style).
 *
 * @param {Object} config
 * @param {string} styleId
 * @param {boolean} [scrollZoom=true] - If `false`, zooming the map by scrolling will
 *   be disabled.
 * @param {boolean} [title=false] - If `true`, the map's title and owner is displayed
 *   in the upper right corner of the map.
 * @param {ownerId} [ownerId]
 */
Styles.getEmbeddableHtml = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    scrollZoom: v.boolean,
    title: v.boolean,
    ownerId: v.string
  })(config);

  var fileName = config.styleId + '.html';
  var query = {};
  if (config.scrollZoom !== undefined) {
    query.zoomwheel = String(config.scrollZoom);
  }
  if (config.title !== undefined) {
    query.title = String(config.title);
  }

  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId/:fileName',
    params: xtend(pick(config, ['ownerId']), {
      fileName: fileName
    }),
    query: query
  });
};

module.exports = createServiceFactory(Styles);
