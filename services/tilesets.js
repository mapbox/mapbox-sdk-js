'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Tilesets API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://www.mapbox.com/api-documentation/#tilesets).
 */
var Tilesets = {};

/**
 * List a user's tilesets.
 *
 * @param {Object} [config]
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Tilesets.listTilesets = function(config) {
  v.assertShape({
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:ownerId',
    params: config
  });
};

module.exports = createServiceFactory(Tilesets);
