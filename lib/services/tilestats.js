'use strict';

var invariant = require('../../vendor/invariant'),
  makeService = require('../make_service'),
  constants = require('../constants');

var Tilestats = module.exports = makeService('MapboxTilestats');

/**
 * To retrieve statistics about a specific tileset.
 *
 * @param {String} tileset - the id for the tileset
 * @param {Function} callback called with (err, tilestats)
 * @returns {undefined} nothing, calls callback
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.getTilestats('tileset-id', function(err, info) {
 *   console.log(info);
 *   // {
 *   //   "layerCount": {layer count},
 *   //   "layers": [
 *   //     {
 *   //       "layer": {layer name},
 *   //       "geometry": {dominant geometry},
 *   //       "count": {feature count},
 *   //       "attributeCount": {attribute count}
 *   //       "attributes": [
 *   //         {
 *   //           "attribute": {attribute name},
 *   //           "type": {attribute type},
 *   //           "count": {unique value count},
 *   //           "min": {minimum value if type is number},
 *   //           "max": {maximum value if type is number},
 *   //           "values": [{...unique values}]
 *   //         }
 *   //       ]
 *   //     }
 *   //   ]
 *   // }
 * });
 */
Tilestats.prototype.getTilestats = function(tileset, callback) {
  invariant(typeof tileset === 'string', 'tileset must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: constants.API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    callback: callback
  });
};


/**
 * To create or update statistics about a specific tileset.
 *
 * @param {String} tileset - the id for the tileset
 * @param {object} statistics - the statistics to upload
 * @param {Function} callback called with (err, tilestats)
 * @returns {undefined} nothing, calls callback
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.getTilestats('tileset-id', function(err, stats) {
 *   console.log(stats);
 *   // {
 *   //   "account": {account}
 *   //   ... see stats example above (for Tilestats#getTilestats)
 *   // }
 * });
 */
Tilestats.prototype.putTilestats = function(tileset, statistics, callback) {
  invariant(typeof tileset === 'string', 'tileset must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: constants.API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    entity: statistics,
    method: 'put',
    callback: callback
  });
};
