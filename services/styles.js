'use strict';

var xtend = require('xtend');
var v = require('./service-helpers/validator');
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Styles API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/maps/#styles).
 */
var Styles = {};

/**
 * Get a style.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#retrieve-a-style).
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {string} [config.ownerId]
 * @param {boolean} [config.metadata=false] - If true, `mapbox:` specific metadata will be preserved
 * @param {boolean} [config.draft=false] - If `true` will retrieve the draft style, otherwise will retrieve the published style.
 * @param {boolean} [config.fresh=false] - If `true`, will bypass the cached version of the style. Fresh style requests have a lower rate limit than cached requests and may have a higher latency. `fresh=true` should never be used in production or high concurrency environments.
 * @return {MapiRequest}
 *
 * @example
 * stylesClient.getStyle({
 *   styleId: 'style-id'
 * })
 *   .send()
 *   .then(response => {
 *     const style = response.body;
 *   });
 */
Styles.getStyle = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    ownerId: v.string,
    metadata: v.boolean,
    draft: v.boolean,
    fresh: v.boolean
  })(config);

  var query = {};
  if (config.metadata) {
    query.metadata = config.metadata;
  }
  if (config.fresh) {
    query.fresh = 'true';
  }

  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId/:styleId' + (config.draft ? '/draft' : ''),
    params: pick(config, ['ownerId', 'styleId']),
    query: query
  });
};

/**
 * Create a style.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#create-a-style).
 *
 * @param {Object} config
 * @param {Object} config.style - Stylesheet JSON object.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * stylesClient.createStyle({
 *   style: {
 *     version: 8,
 *     name: "My Awesome Style",
 *     metadata: {},
 *     sources: {},
 *     layers: [],
 *     glyphs: "mapbox://fonts/{owner}/{fontstack}/{range}.pbf"
 *   }
 * })
 *   .send()
 *   .then(response => {
 *     const style = response.body;
 *   });
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
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#update-a-style).
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {Object} config.style - Stylesheet JSON object.
 * @param {string | number | Date} [config.lastKnownModification] - Datetime of last
 *   known update. Passed as 'If-Unmodified-Since' HTTP header.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * stylesClient.updateStyle({
 *   styleId: 'style-id',
 *   style: {
 *     version: 8,
 *     name: 'My Awesome Style',
 *     metadata: {},
 *     sources: {},
 *     layers: [],
 *     glyphs: 'mapbox://fonts/{owner}/{fontstack}/{range}.pbf'
 *   }
 * })
 *   .send()
 *   .then(response => {
 *     const style = response.body;
 *   });
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
 *
 * @example
 * stylesClient.deleteStyle({
 *   styleId: 'style-id'
 * })
 *   .send()
 *   .then(response => {
 *     // delete successful
 *   });
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
 *
 * @example
 * stylesClient.listStyles()
 *   .send()
 *   .then(response => {
 *     const styles = response.body;
 *   });
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
 *
 * @example
 * stylesClient.putStyleIcon({
 *   styleId: 'foo',
 *   iconId: 'bar',
 *   // The string filename value works in Node.
 *   // In the browser, provide a Blob.
 *   file: 'path/to/file.svg'
 * })
 *   .send()
 *   .then(response => {
 *     const newSprite = response.body;
 *   });
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
 * @param {boolean} [config.draft=false] - If `true` will remove the icon from the draft style, otherwise will remove the icon from the published style.
 * @return {MapiRequest}
 *
 * @example
 * stylesClient.deleteStyleIcon({
 *   styleId: 'foo',
 *   iconId: 'bar'
 * })
 *   .send()
 *   .then(response => {
 *     // delete successful
 *   });
 */
Styles.deleteStyleIcon = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    iconId: v.required(v.string),
    ownerId: v.string,
    draft: v.boolean
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path:
      '/styles/v1/:ownerId/:styleId' +
      (config.draft ? '/draft' : '') +
      '/sprite/:iconId',
    params: pick(config, ['ownerId', 'styleId', 'iconId'])
  });
};

/**
 * Get a style sprite's image or JSON document.
 *
 * See [the corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#retrieve-a-sprite-image-or-json).
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {'json' | 'png'} [config.format="json"]
 * @param {boolean} [config.highRes] - If true, returns spritesheet with 2x
 *   resolution.
 * @param {string} [config.ownerId]
 * @param {boolean} [config.draft=false] - If `true` will retrieve the draft style sprite, otherwise will retrieve the published style sprite.
 * @return {MapiRequest}
 *
 * @example
 * stylesClient.getStyleSprite({
 *   format: 'json',
 *   styleId: 'foo',
 *   highRes: true
 * })
 *   .send()
 *   .then(response => {
 *     const sprite = response.body;
 *   });
 *
 * @example
 * stylesClient.getStyleSprite({
 *   format: 'png',
 *   styleId: 'foo',
 *   highRes: true
 * })
 *   .send()
 *   .then(response => {
 *     const sprite = response.body;
 *     fs.writeFileSync('sprite.png', sprite, 'binary');
 *   });
 */
Styles.getStyleSprite = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    format: v.oneOf('json', 'png'),
    highRes: v.boolean,
    ownerId: v.string,
    draft: v.boolean
  })(config);

  var format = config.format || 'json';
  var fileName = '/sprite' + (config.highRes ? '@2x' : '') + '.' + format;

  return this.client.createRequest(
    xtend(
      {
        method: 'GET',
        path:
          '/styles/v1/:ownerId/:styleId' +
          (config.draft ? '/draft' : '') +
          fileName,
        params: pick(config, ['ownerId', 'styleId'])
      },
      format === 'png' ? { encoding: 'binary' } : {}
    )
  );
};

/**
 * Get a font glyph range.
 *
 * See [the corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#retrieve-font-glyph-ranges).
 *
 * @param {Object} config
 * @param {string|Array<string>} config.fonts - An array of font names.
 * @param {number} config.start - Character code of the starting glyph.
 * @param {number} config.end - Character code of the last glyph,
 *   typically equivalent to`config.start + 255`.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * stylesClient.getFontGlyphRange({
 *   fonts: 'Arial Unicode',
 *   start: 0,
 *   end: 255
 * })
 *   .send()
 *   .then(response => {
 *     const glyph = response.body;
 *   });
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
    }),
    encoding: 'binary'
  });
};

/**
 * Get embeddable HTML displaying a map.
 *
 * See [the corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/#request-embeddable-html).
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {boolean} [config.scrollZoom=true] - If `false`, zooming the map by scrolling will
 *   be disabled.
 * @param {boolean} [config.title=false] - If `true`, the map's title and owner is displayed
 *   in the upper right corner of the map.
 * @param {boolean} [config.fallback=false] - If `true`, serve a fallback raster map.
 * @param {string} [config.mapboxGLVersion] - Specify a version of [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/) to use to render the map.
 * @param {string} [config.mapboxGLGeocoderVersion] - Specify a version of the [Mapbox GL geocoder plugin](https://github.com/mapbox/mapbox-gl-geocoder) to use to render the map search box.
 * @param {string} [config.ownerId]
 * @param {boolean} [config.draft=false] - If `true` will retrieve the draft style, otherwise will retrieve the published style.
 */
Styles.getEmbeddableHtml = function(config) {
  v.assertShape({
    styleId: v.required(v.string),
    scrollZoom: v.boolean,
    title: v.boolean,
    fallback: v.boolean,
    mapboxGLVersion: v.string,
    mapboxGLGeocoderVersion: v.string,
    ownerId: v.string,
    draft: v.boolean
  })(config);

  var fileName = config.styleId + (config.draft ? '/draft' : '') + '.html';
  var query = {};
  if (config.scrollZoom !== undefined) {
    query.zoomwheel = String(config.scrollZoom);
  }
  if (config.title !== undefined) {
    query.title = String(config.title);
  }
  if (config.fallback !== undefined) {
    query.fallback = String(config.fallback);
  }
  if (config.mapboxGLVersion !== undefined) {
    query.mapboxGLVersion = String(config.mapboxGLVersion);
  }
  if (config.mapboxGLGeocoderVersion !== undefined) {
    query.mapboxGLGeocoderVersion = String(config.mapboxGLGeocoderVersion);
  }

  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId/' + fileName,
    params: pick(config, ['ownerId']),
    query: query
  });
};

module.exports = createServiceFactory(Styles);
