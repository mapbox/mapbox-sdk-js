'use strict';

var xtend = require('xtend');
var v = require('./service-helpers/validator');
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Fonts API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/maps/fonts/).
 */
var Fonts = {};

/**
 * Get a font glyph range.
 *
 * See [the corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/fonts/#retrieve-font-glyph-ranges).
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
 * fontsClient.getFontGlyphRange({
 *   fonts: 'Arial Unicode',
 *   start: 0,
 *   end: 255
 * })
 *   .send()
 *   .then(response => {
 *     const glyph = response.body;
 *   });
 */
Fonts.getFontGlyphRange = function(config) {
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
 * List fonts in your account.
 *
 * See [the corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/fonts/#list-fonts).
 *
 * @param {Object} [config]
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * fontsClient.listFonts()
 *   .send()
 *   .then(response => {
 *     const fonts = response.body;
 *   });
 */
Fonts.listFonts = function(config) {
  config = config || {};
  v.assertShape({
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/fonts/v1/:ownerId',
    params: pick(config, ['ownerId'])
  });
};

/**
 * Add a font
 *
 * See [the corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/fonts/#add-a-font).
 *
 * @param {Object} config
 * @param {UploadableFile} config.file - A TTF or OTF file.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * fontsClient.createFont({
 *   file: 'path/to/file.ttf'
 * })
 *   .send()
 *   .then(response => {
 *     const newFont = response.body;
 *   });
 */
Fonts.createFont = function(config) {
  v.assertShape({
    file: v.file,
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/fonts/v1/:ownerId',
    params: pick(config, ['ownerId']),
    file: config.file
  });
};

/**
 * Delete a font.
 *
 * See [the corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/fonts/#delete-a-font).
 *
 * @param {Object} config
 * @param {string} config.font
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * fontsClient.deleteFont({
 *   font: 'Custom Font Regular'
 * })
 *   .send()
 *   .then(response => {
 *     // delete successful
 *   });
 */
Fonts.deleteFont = function(config) {
  v.assertShape({
    font: v.required(v.string),
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/fonts/v1/:ownerId/:font',
    params: config
  });
};

/**
 * Get font metadata.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/fonts/#retrieve-font-metadata).
 *
 * @param {Object} config
 * @param {string} config.font
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * fontsClient.getFontMetadata({
 *   font: 'Custom Font Regular'
 * })
 *   .send()
 *   .then(response => {
 *     const metadata = response.body;
 *   });
 */
Fonts.getFontMetadata = function(config) {
  v.assertShape({
    font: v.required(v.string),
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/fonts/v1/:ownerId/:font/metadata',
    params: pick(config, ['ownerId', 'font'])
  });
};

/**
 * Update font metadata.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/maps/fonts/#update-font-metadata).
 *
 * @param {Object} config
 * @param {string} config.font
 * @param {String} config.visibility - `visibility` property of font metadata. The only valid values are `public` and `private`.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * fontsClient.updateFontMetadata({
 *   font: 'Custom Font Regular',
 *   visibility: 'public'
 * })
 *   .send()
 *   .then(response => {
 *     const metadata = response.body;
 *   });
 */
Fonts.updateFontMetadata = function(config) {
  v.assertShape({
    font: v.required(v.string),
    visibility: v.required.oneOf(['public', 'private']),
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'PATCH',
    path: '/fonts/v1/:ownerId/:font/metadata',
    params: pick(config, ['font', 'ownerId']),
    body: { visibility: config.visibility }
  });
};

module.exports = createServiceFactory(Fonts);
