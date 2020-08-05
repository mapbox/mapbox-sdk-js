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
 * Delete a tileset
 *
 * @param {Object} config
 * @param {string} config.tilesetId ID of the tileset to be deleted in the form `username.tileset_id`.
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.deleteTileset({
 *     tilesetId: 'username.tileset_id'
 *   })
 *   .send()
 *   .then(response => {
 *     const deleted = response.statusCode === 204;
 *   });
 */
Tilesets.deleteTileset = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/tilesets/v1/:tilesetId',
    params: pick(config, ['tilesetId'])
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
 * tilesetsClient.createTilesetSource({
 *      id: 'tileset_source_id',
 *      // The string filename value works in Node.
 *      // In the browser, provide a Blob.
 *      file: 'path/to/file.geojson.ld'
 *   })
 *   .send()
 *   .then(response => {
 *     const tilesetSource = response.body;
 *   });
 */
Tilesets.createTilesetSource = function(config) {
  v.assertShape({
    id: v.required(v.string),
    file: v.required(v.file),
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/tilesets/v1/sources/:ownerId/:id',
    params: pick(config, ['ownerId', 'id']),
    file: config.file,
    sendFileAs: 'form'
  });
};

/**
 * Retrieve a tileset source information
 *
 * @param {Object} config
 * @param {string} config.id ID of the tileset source.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.getTilesetSource({
 *      id: 'tileset_source_id'
 *   })
 *   .send()
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
    params: pick(config, ['ownerId', 'id'])
  });
};

/**
 * List tileset sources
 *
 * @param {Object} [config]
 * @param {string} [config.ownerId]
 * @param {number} [config.limit=100] - The maximum number of tilesets to return, from 1 to 500.
 * @param {string} [config.start] - The tileset after which to start the listing.
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
    ownerId: v.string,
    limit: v.range([1, 500]),
    start: v.string
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/sources/:ownerId',
    params: config ? pick(config, ['ownerId']) : {},
    query: config ? pick(config, ['limit', 'start']) : {}
  });
};

/**
 * Delete a tileset source
 *
 * @param {Object} config
 * @param {string} config.id ID of the tileset source to be deleted.
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.deleteTilesetSource({
 *     id: 'tileset_source_id'
 *   })
 *   .send()
 *   .then(response => {
 *     const deleted = response.statusCode === 201;
 *   });
 */
Tilesets.deleteTilesetSource = function(config) {
  v.assertShape({
    id: v.required(v.string),
    ownerId: v.string
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/tilesets/v1/sources/:ownerId/:id',
    params: pick(config, ['ownerId', 'id'])
  });
};

/**
 * Create a tileset
 *
 * @param {Object} config
 * @param {string} config.tilesetId ID of the tileset to be created in the form `username.tileset_name`.
 * @param {Object} config.recipe The [tileset recipe](https://docs.mapbox.com/help/troubleshooting/tileset-recipe-reference/) to use in JSON format.
 * @param {string} config.name Name of the tileset.
 * @param {boolean} [config.private=true] A private tileset must be used with an access token from your account.
 * @param {string} [config.description] Description of the tileset.
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.createTileset({
 *     tilesetId: 'username.tileset_id',
 *     recipe: {
 *       version: 1,
 *       layers: {
 *         my_new_layer: {
 *           source: "mapbox://tileset-source/{username}/{id}",
 *           minzoom: 0,
 *           maxzoom: 8
 *         }
 *       }
 *     },
 *     name: 'My Tileset'
 *   })
 *   .send()
 *   .then(response => {
 *     const message = response.body.message;
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
    params: pick(config, ['tilesetId']),
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
 * tilesetsClient.publishTileset({
 *     tilesetId: 'username.tileset_id'
 *   })
 *   .send()
 *   .then(response => {
 *     const tilesetPublishJob = response.body;
 *   });
 */
Tilesets.publishTileset = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/tilesets/v1/:tilesetId/publish',
    params: pick(config, ['tilesetId'])
  });
};

/**
 * Update a tileset
 *
 * @param {Object} config
 * @param {string} config.tilesetId ID of the tileset in the form `username.tileset_name`.
 * @param {string} [config.name]
 * @param {string} [config.description]
 * @param {boolean} [config.private]
 * @param {Array} [config.attribution]
 * @param {string} [config.attribution[].text]
 * @param {string} [config.attribution[].link]
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.updateTileset({
 *     tilesetId: 'username.tileset_name',
 *     name: 'Tileset Name',
 *     private: true,
 *     attribution: [
 *      {
 *        text: 'Source Name',
 *        link: 'https://example.com'
 *      }
 *     ]
 *   })
 *   .send()
 *   .then(response => {
 *     const updated = response.statusCode === 204;
 *   });
 */
Tilesets.updateTileset = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string),
    name: v.string,
    description: v.string,
    private: v.boolean,
    attribution: v.arrayOf(
      v.strictShape({
        text: v.required(v.string),
        link: v.required(v.string)
      })
    )
  })(config);

  return this.client.createRequest({
    method: 'PATCH',
    path: '/tilesets/v1/:tilesetId',
    params: pick(config, ['tilesetId']),
    body: config
      ? pick(config, ['name', 'description', 'private', 'attribution'])
      : {}
  });
};

/**
 * Retrieve the status of a tileset
 *
 * @param {Object} config
 * @param {string} config.tilesetId ID of the tileset in the form `username.tileset_name`.
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.tilesetStatus({
 *     tilesetId: 'username.tileset_name'
 *   })
 *   .send()
 *   .then(response => {
 *     const tilesetStatus = response.body;
 *   });
 */
Tilesets.tilesetStatus = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:tilesetId/status',
    params: pick(config, ['tilesetId'])
  });
};

/**
 * Retrieve information about a single tileset job
 *
 * @param {Object} config
 * @param {string} config.tilesetId ID of the tileset in the form `username.tileset_name`.
 * @param {string} config.jobId The publish job's ID.
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.tilesetJob({
 *     tilesetId: 'username.tileset_name'
 *     jobId: 'job_id'
 *   })
 *   .send()
 *   .then(response => {
 *     const tilesetJob = response.body;
 *   });
 */
Tilesets.tilesetJob = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string),
    jobId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:tilesetId/jobs/:jobId',
    params: pick(config, ['tilesetId', 'jobId'])
  });
};

/**
 * List information about all jobs for a tileset
 *
 * @param {Object} config
 * @param {string} config.tilesetId ID of the tileset in the form `username.tileset_name`.
 * @param {'processing'|'queued'|'success'|'failed'} [config.stage]
 * @param {number} [config.limit=100] - The maximum number of tilesets to return, from 1 to 500.
 * @param {string} [config.start] - The tileset after which to start the listing.
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.listTilesetJobs({
 *     tilesetId: 'username.tileset_name'
 *   })
 *   .send()
 *   .then(response => {
 *     const jobs = response.body;
 *   });
 */
Tilesets.listTilesetJobs = function(config) {
  v.assertShape({
    tilesetId: v.required(v.string),
    stage: v.oneOf('processing', 'queued', 'success', 'failed'),
    limit: v.range([1, 500]),
    start: v.string
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tilesets/v1/:tilesetId/jobs',
    params: pick(config, ['tilesetId']),
    query: pick(config, ['stage', 'limit', 'start'])
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
 * @param {Object} config.recipe The [tileset recipe](https://docs.mapbox.com/help/troubleshooting/tileset-recipe-reference/) to validate in JSON format.
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.validateRecipe({
 *     recipe: {
 *       version: 1,
 *       layers: {
 *         my_new_layer: {
 *           source: "mapbox://tileset-source/{username}/{id}",
 *           minzoom: 0,
 *           maxzoom: 8
 *         }
 *       }
 *     }
 *   })
 *   .send()
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
    body: config.recipe
  });
};

/**
 * Retrieve a recipe
 *
 * @param {Object} config
 * @param {string} config.tilesetId ID of the tileset in the form `username.tileset_name`.
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.getRecipe({
 *     tilesetId: 'username.tileset_name'
 *   })
 *   .send()
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
    params: pick(config, ['tilesetId'])
  });
};

/**
 * Update a tileset recipe
 *
 * @param {Object} config
 * @param {string} config.tilesetId ID of the tileset in the form `username.tileset_name`.
 * @param {Object} config.recipe The [tileset recipe](https://docs.mapbox.com/help/troubleshooting/tileset-recipe-reference/) in JSON format.
 * @return {MapiRequest}
 *
 * @example
 * tilesetsClient.updateRecipe({
 *     tilesetId: 'username.tileset_name',
 *     recipe: {
 *       version: 1,
 *       layers: {
 *         my_new_layer: {
 *           source: "mapbox://tileset-source/{username}/{id}",
 *           minzoom: 0,
 *           maxzoom: 8
 *         }
 *       }
 *     }
 *   })
 *   .send()
 *   .then(response => {
 *     const updated = response.statusCode === 204;
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
    params: pick(config, ['tilesetId']),
    body: config.recipe
  });
};

module.exports = createServiceFactory(Tilesets);
