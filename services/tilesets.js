'use strict';

var v = require('./service-helpers/validator');
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
 * @param {Object} [query]
 * @param {string} [query.type] - Filter results by tileset type, either `raster` or `vector`.
 * @param {number} [query.limit] - The maximum number of tilesets to return, from 1 to 500. The default is 100.
 * @param {string} [query.sortBy] - Sort the listings by their `created` or `modified` timestamps.
 * @param {string} [query.start] - The tileset after which to start the listing.
 * @param {string} [query.visibility] - Filter results by visibility, either `public` or `private`
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
Tilesets.listTilesets = function(config, query) {
  v.assertShape({
    ownerId: v.string
  })(config);

  v.assertShape({
    limit: v.range([1, 500]),
    sortBy: v.oneOf('created', 'modified'),
    start: v.string,
    type: v.oneOf('raster', 'vector'),
    visibility: v.oneOf('public', 'private')
  })(query);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:ownerId',
    params: config,
    query: query
  });
};

/**
 * Retrieve metadata about a tileset.
 *
 * @param {Object} [config]
 * @param {string} [config.ownerId]
 * @param {Object} [query]
 * @param {string} [query.tilesetId] - Unique identifier for the tileset in the format `username.id`.
 *
 * @return {MapiRequest}
 */
Tilesets.tileJSONMetadata = function(config, query) {
  v.assertShape({
    ownerId: v.string
  })(config);

  v.assertShape({
    tilesetId: v.required(v.string)
  })(query);

  return this.client.createRequest({
    method: 'GET',
    path: '/v4/:tilesetId.json',
    params: query
  });
};

module.exports = createServiceFactory(Tilesets);
