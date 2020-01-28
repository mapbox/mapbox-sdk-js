'use strict';

var v = require('./service-helpers/validator');
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Tilesets API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/maps/#tilesets).
 */
var Tilesets = {};

/**
 * List a user's tilesets.
 *
 * @param {Object} [config]
 * @param {string} [config.ownerId]
 * @param {'raster'|'vector'} [config.type] - Filter results by tileset type, either `raster` or `vector`.
 * @param {number} [config.limit=100] - The maximum number of tilesets to return, from 1 to 500.
 * @param {'created'|'modified'} [config.sortBy] - Sort the listings by their `created` or `modified` timestamps.
 * @param {string} [config.start] - The tileset after which to start the listing.
 * @param {'public'|'private'} [config.visibility] - Filter results by visibility, either `public` or `private`
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.listTilesets()
 *   .send()
 *   .then(response => {
 *     const tilesets = response.body;
 *   });
 *
 * @example
 * tilesetsClient.listTilesets()
 *   .eachPage((error, response, next) => {
 *     // Handle error or response and call next.
 *   });
 */
Tilesets.listTilesets = function(config) {
  v.assertShape({
    ownerId: v.string,
    limit: v.range([1, 500]),
    sortBy: v.oneOf('created', 'modified'),
    start: v.string,
    type: v.oneOf('raster', 'vector'),
    visibility: v.oneOf('public', 'private')
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:ownerId',
    params: config ? pick(config, ['ownerId']) : {},
    query: config
      ? pick(config, ['limit', 'sortBy', 'start', 'type', 'visibility'])
      : {}
  });
};

/**
 * Retrieve metadata about a tileset.
 *
 * @param {Object} [config]
 * @param {string} [config.tilesetId] - Unique identifier for the tileset in the format `username.id`.
 *
 * @return {MapiRequest}
 */
Tilesets.tileJSONMetadata = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/v4/:tilesetId.json',
    params: pick(config, ['tilesetId'])
  });
};

module.exports = createServiceFactory(Tilesets);
