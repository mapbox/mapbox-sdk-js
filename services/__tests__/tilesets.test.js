'use strict';

const tilesetsService = require('../tilesets');
const tu = require('../../test/test-utils');

let tilesets;
beforeEach(() => {
  tilesets = tilesetsService(tu.mockClient());
});

describe('listTilesets', () => {
  test('works', () => {
    tilesets.listTilesets();
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:ownerId',
      method: 'GET',
      params: {},
      query: {}
    });
  });

  test('works with query params', () => {
    tilesets.listTilesets({
      ownerId: 'specialguy',
      limit: 250,
      type: 'raster'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:ownerId',
      method: 'GET',
      params: { ownerId: 'specialguy' },
      query: { limit: 250, type: 'raster' }
    });
  });
});

describe('deleteTileset', () => {
  test('works', () => {
    tilesets.deleteTileset({ tilesetId: 'hello-world' });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId',
      method: 'DELETE',
      params: { tilesetId: 'hello-world' }
    });
  });
});

describe('tileJSONMetadata', () => {
  test('works', () => {
    tilesets.tileJSONMetadata({ tilesetId: 'hello-world' });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/v4/:tilesetId.json',
      method: 'GET',
      params: { tilesetId: 'hello-world' }
    });
  });
});

describe('createTilesetSource', () => {
  test('works', () => {
    tilesets.createTilesetSource({
      id: 'tileset_source_id',
      file: 'path/to/file.geojson'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/sources/:ownerId/:id',
      method: 'POST',
      params: {
        id: 'tileset_source_id'
      },
      file: 'path/to/file.geojson',
      sendFileAs: 'form'
    });
  });

  test('works with specified ownerId', () => {
    tilesets.createTilesetSource({
      ownerId: 'specialguy',
      id: 'tileset_source_id',
      file: 'path/to/file.geojson'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/sources/:ownerId/:id',
      method: 'POST',
      params: {
        ownerId: 'specialguy',
        id: 'tileset_source_id'
      },
      file: 'path/to/file.geojson',
      sendFileAs: 'form'
    });
  });
});

describe('getTilesetSource', () => {
  test('works', () => {
    tilesets.getTilesetSource({
      id: 'tileset_source_id'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/sources/:ownerId/:id',
      method: 'GET',
      params: {
        id: 'tileset_source_id'
      }
    });
  });

  test('works with specified ownerId', () => {
    tilesets.getTilesetSource({
      ownerId: 'specialguy',
      id: 'tileset_source_id'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/sources/:ownerId/:id',
      method: 'GET',
      params: {
        ownerId: 'specialguy',
        id: 'tileset_source_id'
      }
    });
  });
});

describe('listTilesetSources', () => {
  test('works', () => {
    tilesets.listTilesetSources();
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/sources/:ownerId',
      method: 'GET',
      params: {},
      query: {}
    });
  });

  test('works with specified ownerId', () => {
    tilesets.listTilesetSources({
      ownerId: 'specialguy'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/sources/:ownerId',
      method: 'GET',
      params: {
        ownerId: 'specialguy'
      },
      query: {}
    });
  });

  test('works with query params', () => {
    tilesets.listTilesetSources({
      ownerId: 'specialguy',
      limit: 250
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/sources/:ownerId',
      method: 'GET',
      params: { ownerId: 'specialguy' },
      query: { limit: 250 }
    });
  });
});

describe('deleteTilesetSource', () => {
  test('works', () => {
    tilesets.deleteTilesetSource({
      id: 'tileset_source_id'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/sources/:ownerId/:id',
      method: 'DELETE',
      params: {
        id: 'tileset_source_id'
      }
    });
  });

  test('works with specified ownerId', () => {
    tilesets.deleteTilesetSource({
      ownerId: 'specialguy',
      id: 'tileset_source_id'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/sources/:ownerId/:id',
      method: 'DELETE',
      params: {
        ownerId: 'specialguy',
        id: 'tileset_source_id'
      }
    });
  });
});

describe('createTileset', () => {
  test('works', () => {
    tilesets.createTileset({
      tilesetId: 'tileset_id',
      recipe: { version: 1 },
      name: 'Tileset Name'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId',
      method: 'POST',
      params: {
        tilesetId: 'tileset_id'
      },
      body: {
        recipe: { version: 1 },
        name: 'Tileset Name'
      }
    });
  });

  test('works with specified private and description', () => {
    tilesets.createTileset({
      tilesetId: 'tileset_id',
      recipe: { version: 1 },
      name: 'Tileset Name',
      private: false,
      description: 'Tileset Description'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId',
      method: 'POST',
      params: {
        tilesetId: 'tileset_id'
      },
      body: {
        recipe: { version: 1 },
        name: 'Tileset Name',
        private: false,
        description: 'Tileset Description'
      }
    });
  });
});

describe('publishTileset', () => {
  test('works', () => {
    tilesets.publishTileset({
      tilesetId: 'tileset_id'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId/publish',
      method: 'POST',
      params: {
        tilesetId: 'tileset_id'
      }
    });
  });
});

describe('updateTileset', () => {
  test('works', () => {
    tilesets.updateTileset({
      tilesetId: 'tileset_id'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId',
      method: 'PATCH',
      params: {
        tilesetId: 'tileset_id'
      },
      body: {}
    });
  });

  test('works with properties', () => {
    tilesets.updateTileset({
      tilesetId: 'tileset_id',
      name: 'foo',
      description: 'bar',
      private: true,
      attribution: [
        {
          text: 'Text',
          link: 'http://example.com'
        }
      ]
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId',
      method: 'PATCH',
      params: {
        tilesetId: 'tileset_id'
      },
      body: {
        name: 'foo',
        description: 'bar',
        private: true,
        attribution: [
          {
            text: 'Text',
            link: 'http://example.com'
          }
        ]
      }
    });
  });
});

describe('tilesetStatus', () => {
  test('works', () => {
    tilesets.tilesetStatus({
      tilesetId: 'tileset_id'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId/status',
      method: 'GET',
      params: {
        tilesetId: 'tileset_id'
      }
    });
  });
});

describe('tilesetJob', () => {
  test('works', () => {
    tilesets.tilesetJob({
      tilesetId: 'tileset_id',
      jobId: 'job_id'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId/jobs/:jobId',
      method: 'GET',
      params: {
        tilesetId: 'tileset_id',
        jobId: 'job_id'
      }
    });
  });
});

describe('listTilesetJobs', () => {
  test('works', () => {
    tilesets.listTilesetJobs({
      tilesetId: 'tileset_id'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId/jobs',
      method: 'GET',
      params: {
        tilesetId: 'tileset_id'
      },
      query: {}
    });
  });

  test('works with stage', () => {
    tilesets.listTilesetJobs({
      tilesetId: 'tileset_id',
      stage: 'success'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId/jobs',
      method: 'GET',
      params: {
        tilesetId: 'tileset_id'
      },
      query: {
        stage: 'success'
      }
    });
  });

  test('works with query params', () => {
    tilesets.listTilesetJobs({
      tilesetId: 'tileset_id',
      limit: 250
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId/jobs',
      method: 'GET',
      params: {
        tilesetId: 'tileset_id'
      },
      query: {
        limit: 250
      }
    });
  });
});

describe('getTilesetsQueue', () => {
  test('works', () => {
    tilesets.getTilesetsQueue();
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/queue',
      method: 'PUT'
    });
  });
});

describe('validateRecipe', () => {
  test('works', () => {
    tilesets.validateRecipe({
      recipe: { version: 1 }
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/validateRecipe',
      method: 'PUT',
      body: { version: 1 }
    });
  });
});

describe('getRecipe', () => {
  test('works', () => {
    tilesets.getRecipe({
      tilesetId: 'tileset_id'
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId/recipe',
      method: 'GET',
      params: {
        tilesetId: 'tileset_id'
      }
    });
  });
});

describe('updateRecipe', () => {
  test('works', () => {
    tilesets.updateRecipe({
      tilesetId: 'tileset_id',
      recipe: { version: 1 }
    });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:tilesetId/recipe',
      method: 'PATCH',
      params: { tilesetId: 'tileset_id' },
      body: { version: 1 }
    });
  });
});
