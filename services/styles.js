'use strict';

var v = require('./service-helpers/validator');
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Styles API service.
 */
var Styles = {};

/**
 * Get a style.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#retrieve-a-style).
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.getStyle = function(config) {
  v.validate(
    {
      styleId: v.string.required,
      ownerId: v.string
    },
    config
  );

  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId/:styleId',
    params: config
  });
};

/**
 * Create a style.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#create-a-style).
 *
 * @param {Object} config
 * @param {Object} config.style - Stylesheet JSON object.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.createStyle = function(config) {
  v.validate(
    {
      style: v.plainObject,
      ownerId: v.string
    },
    config
  );

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
 * See the [public documentation](https://www.mapbox.com/api-documentation/#update-a-style).
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
  v.validate(
    {
      styleId: v.string.required,
      style: v.plainObject.required,
      lastKnownModification: v.date,
      ownerId: v.string
    },
    config
  );

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
  v.validate(
    {
      styleId: v.string.required,
      ownerId: v.string
    },
    config
  );

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
 * @param {string} [config.start] - The style ID of the last style in the
 *   previous page.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.listStyles = function(config) {
  config = config || {};
  v.validate(
    {
      start: v.string,
      ownerId: v.string
    },
    config
  );

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
 * Add an icon to a style.
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {string} config.iconId
 * @param {(Blob|ArrayBuffer|string|ReadableStream)} config.file - An SVG file.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.createStyleIcon = function(config) {
  v.validate(
    {
      styleId: v.string.required,
      iconId: v.string.required,
      file: v.file,
      ownerId: v.string
    },
    config
  );

  return this.client.createRequest({
    method: 'PUT',
    path: '/styles/v1/:ownerId/:styleId/sprite/:iconId',
    params: pick(config, ['ownerId', 'styleId', 'iconId']),
    file: config.file,
    headers: {
      'Content-Type': 'application/octet-stream'
    }
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
  v.validate(
    {
      styleId: v.string.required,
      iconId: v.string.required,
      ownerId: v.string
    },
    config
  );

  return this.client.createRequest({
    method: 'DELETE',
    path: '/styles/v1/:ownerId/:styleId/sprite/:iconId',
    params: config
  });
};

/**
 * Get a style's spritesheet in the JSON format.
 *
 * @param {Object} config
 * @param {string} config.styleId
 * @param {boolean} [config.highRes] - If true, returns spritesheet with 2x
 *   resolution.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Styles.getStyleSpriteJson = function(config) {
  v.validate(
    {
      styleId: v.string.required,
      highRes: v.boolean,
      ownerId: v.string
    },
    config
  );

  var fileName = 'sprite' + (config.highRes ? '@2x' : '') + '.json';

  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId/:styleId/:fileName',
    params: {
      fileName: fileName,
      ownerId: config.ownerId,
      styleId: config.styleId
    }
  });
};

module.exports = createServiceFactory(Styles);
