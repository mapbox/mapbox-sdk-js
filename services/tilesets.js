'use strict';

var v = require('./service-helpers/validator').v;
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Tilesets API service.
 */
var Tilesets = {};

/**
 * List a user's tilesets.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#list-tilesets).
 *
 * @param {Object} [config]
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Tilesets.listTilesets = function(config) {
  v.warn(
    v.shapeOf({
      ownerId: v.string
    })
  )(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:ownerId',
    params: config
  });
};

module.exports = createServiceFactory(Tilesets);
