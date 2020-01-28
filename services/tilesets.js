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

/**
 * Create a tileset source
 *
 * @param {Object} config
 * @param {string} config.id ID of the tileset source to be created.
 * @param {UploadableFile} config.file Line-delimeted GeoJSON file.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.createTilesetSource()
 *   .send({
 *      id: 'tileset_source_id',
 *      // The string filename value works in Node.
 *      // In the browser, provide a Blob.
 *      file: 'path/to/file.geojson.ld'
 *   })
 *   .then(response => {
 *     const tilesetSource = response.body;
 *   });
 */
Tilesets.createTilesetSource = function(config) {
  v.assertShape({
    id: v.required(v.string),
    file: v.file,
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/tilesets/v1/sources/:ownerId/:id',
    params: config,
    file: config.file
  });
};

/**
 * Retrieve a tileset source information
 *
 * @param {Object} config
 * @param {string} config.id ID of the tileset source to be created.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.getTilesetSource()
 *   .send({
 *      id: 'tileset_source_id'
 *   })
 *   .then(response => {
 *     const tilesetSource = response.body;
 *   });
 */
Tilesets.getTilesetSource = function(config) {
  v.assertShape({
    id: v.required(v.string),
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/sources/:ownerId/:id',
    params: config
  });
};

/**
 * List tileset sources
 *
 * @param {Object} [config]
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.listTilesetSources()
 *   .send()
 *   .then(response => {
 *     const tilesetSources = response.body;
 *   });
 */
Tilesets.listTilesetSources = function(config) {
  v.assertShape({
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/sources/:ownerId',
    params: config
  });
};

/**
 * Delete tileset source
 *
 * @param {Object} config
 * @param {string} config.id ID of the tileset source to be deleted.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.deleteTilesetSource()
 *   .send({
 *     id: 'tileset_source_id'
 *   })
 *   .then(response => {
 *   });
 */
Tilesets.deleteTilesetSource = function(config) {
  v.assertShape({
    ownerId: v.string,
    id: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/tilesets/v1/sources/:ownerId/:id',
    params: config
  });
};

/**
 * Create a tileset
 *
 * @param {Object} config
 * @param {string} config.tilesetId ID of the tileset to be created in the form `username.tileset_name`.
 * @param {Object} config.recipe JSON recipe
 * @param {string} config.name Name of the tileset
 * @param {boolean} [config.private=true]
 * @param {string} [config.description]
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.createTileset()
 *   .send({
 *     tilesetId: 'username.tileset_id'
 *   })
 *   .then(response => {
 *     const tilesets = response.body;
 *   });
 */
Tilesets.createTileset = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string),
    recipe: v.required(v.plainObject),
    name: v.required(v.string),
    private: v.boolean,
    description: v.string
  })(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/tilesets/v1/:tilesetId',
    params: config,
    body: pick(config, ['recipe', 'name', 'private', 'description'])
  });
};

/**
 * Publish a tileset
 *
 * @param {Object} config
 * @param {string} config.tilesetId ID of the tileset to publish in the form `username.tileset_name`.
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.publishTileset()
 *   .send({
 *     tilesetId: 'username.tileset_id'
 *   })
 *   .then(response => {
 *     const tilesets = response.body;
 *   });
 */
Tilesets.publishTileset = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/tilesets/v1/:tileset/publish',
    params: config
  });
};

/**
 * Retrieve the status of a tileset
 *
 * @param {Object} config
 * @param {string} config.tilesetId
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.tilesetStatus()
 *   .send({
 *     tilesetId: 'username.tileset_name'
 *   })
 *   .then(response => {
 *     const status = response.body;
 *   });
 */
Tilesets.tilesetStatus = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:tilesetId/status',
    params: config
  });
};

/**
 * Retrieve information about a single tileset job
 *
 * @param {Object} config
 * @param {string} config.tilesetId
 * @param {string} config.jobId
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.tilesetJob()
 *   .send({
 *     tileset: 'tileset_id'
 *   })
 *   .then(response => {
 *     const job = response.body;
 *   });
 */
Tilesets.tilesetJob = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string),
    jobId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:tileset/jobs/:jobId',
    params: config
  });
};

/**
 * List information about all jobs for a tileset
 *
 * @param {Object} config
 * @param {string} config.tilesetId
 * @param {'processing'|'queued'|'success'|'failed'} [config.stage]
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.listTilesetJobs()
 *   .send({
 *     tileset: 'tileset_id'
 *   })
 *   .then(response => {
 *     const jobs = response.body;
 *   });
 */
Tilesets.listTilesetJobs = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string),
    stage: v.oneOf('processing', 'queued', 'success', 'failed')
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:tileset/jobs',
    params: config,
    query: pick(config, ['stage'])
  });
};

/**
 * View Tilesets API global queue
 *
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.getTilesetsQueue()
 *   .send()
 *   .then(response => {
 *     const queue = response.body;
 *   });
 */
Tilesets.getTilesetsQueue = function() {
  return this.client.createRequest({
    method: 'PUT',
    path: '/tilesets/v1/queue'
  });
};

/**
 * Validate a recipe
 *
 * @param {Object} config
 * @param {Object} config.recipe
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.validateRecipe()
 *   .send({
 *     recipe: { ... }
 *   })
 *   .then(response => {
 *     const validation = response.body;
 *   });
 */
Tilesets.validateRecipe = function(config) {
  v.assertShape({
    recipe: v.required(v.plainObject)
  })(config);

  return this.client.createRequest({
    method: 'PUT',
    path: '/tilesets/v1/validateRecipe',
    params: config,
    body: config.recpie
  });
};

/**
 * Retrieve a recipe
 *
 * @param {Object} config
 * @param {Object} config.tilesetId
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.validateRecipe()
 *   .send({
 *     tilesetId: 'username.tileset_name'
 *   })
 *   .then(response => {
 *     const recipe = response.body;
 *   });
 */
Tilesets.getRecipe = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:tilesetId/recipe',
    params: config
  });
};

/**
 * Update a tileset recipe
 *
 * @param {Object} config
 * @param {Object} config.tilesetId
 * @param {Object} config.recipe
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.updateRecipe()
 *   .send({
 *     tilesetId: 'username.tileset_name',
 *     recipe:
 *   })
 *   .then(response => {
 *     const recipe = response.body;
 *   });
 */
Tilesets.updateRecipe = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string),
    recipe: v.required(v.plainObject)
  })(config);

  return this.client.createRequest({
    method: 'PATCH',
    path: '/tilesets/v1/:tilesetId/recipe',
    params: config,
    body: config.recipe
  });
};

module.exports = createServiceFactory(Tilesets);
