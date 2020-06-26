'use strict';

const datasetsService = require('../datasets');
const tu = require('../../test/test-utils');

let datasets;
beforeEach(() => {
  datasets = datasetsService(tu.mockClient());
});

describe('listDatasets', () => {
  test('works', () => {
    datasets.listDatasets();
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId',
      method: 'GET',
      query: {}
    });
  });

  test('with properties', () => {
    datasets.listDatasets({
      sortby: 'created'
    });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId',
      method: 'GET',
      query: {
        sortby: 'created'
      }
    });
  });
});

describe('createDataset', () => {
  test('works', () => {
    datasets.createDataset();
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId',
      method: 'POST'
    });
  });

  test('with properties', () => {
    datasets.createDataset({
      name: 'mock-name',
      description: 'mock-description'
    });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId',
      method: 'POST',
      body: {
        name: 'mock-name',
        description: 'mock-description'
      }
    });
  });
});

describe('getMetadata', () => {
  test('works', () => {
    datasets.getMetadata({ datasetId: 'mock-dataset' });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId/:datasetId',
      method: 'GET',
      params: {
        datasetId: 'mock-dataset'
      }
    });
  });
});

describe('updateMetadata', () => {
  test('works', () => {
    datasets.updateMetadata({ datasetId: 'mock-dataset' });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId/:datasetId',
      method: 'PATCH',
      params: {
        datasetId: 'mock-dataset'
      },
      body: {}
    });
  });

  test('with properties', () => {
    datasets.updateMetadata({
      datasetId: 'mock-dataset',
      name: 'mock-name',
      description: 'mock-description'
    });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId/:datasetId',
      method: 'PATCH',
      params: {
        datasetId: 'mock-dataset'
      },
      body: { name: 'mock-name', description: 'mock-description' }
    });
  });
});

describe('deleteDataset', () => {
  test('works', () => {
    datasets.deleteDataset({ datasetId: 'mock-dataset' });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId/:datasetId',
      method: 'DELETE',
      params: {
        datasetId: 'mock-dataset'
      }
    });
  });
});

describe('listFeatures', () => {
  test('works', () => {
    datasets.listFeatures({ datasetId: 'mock-dataset' });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId/:datasetId/features',
      method: 'GET',
      params: {
        datasetId: 'mock-dataset'
      },
      query: {}
    });
  });

  test('with limit and start', () => {
    datasets.listFeatures({
      datasetId: 'mock-dataset',
      limit: 100,
      start: 'mock-feature'
    });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId/:datasetId/features',
      method: 'GET',
      params: {
        datasetId: 'mock-dataset'
      },
      query: { limit: 100, start: 'mock-feature' }
    });
  });
});

describe('putFeature', () => {
  test('updates an existing feature with partial data', () => {
    datasets.putFeature({
      datasetId: 'mock-dataset',
      featureId: 'mock-feature',
      feature: { geometry: { type: 'Point', coordinates: [0, 10] } }
    });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId/:datasetId/features/:featureId',
      method: 'PUT',
      params: {
        datasetId: 'mock-dataset',
        featureId: 'mock-feature'
      },
      body: { geometry: { type: 'Point', coordinates: [0, 10] } }
    });
  });

  test('creates a brand new feature', () => {
    datasets.putFeature({
      datasetId: 'mock-dataset',
      featureId: 'mock-feature',
      feature: {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 10] }
      }
    });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId/:datasetId/features/:featureId',
      method: 'PUT',
      params: {
        datasetId: 'mock-dataset',
        featureId: 'mock-feature'
      },
      body: {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 10] }
      }
    });
  });

  test('errors if feature ID does not match featureId in config', () => {
    tu.expectError(
      () => {
        datasets.putFeature({
          datasetId: 'mock-dataset',
          featureId: 'mock-feature',
          feature: {
            type: 'Feature',
            id: 'foo',
            geometry: { type: 'Point', coordinates: [0, 10] }
          }
        });
      },
      error => {
        expect(error.message).toMatch(
          'featureId must match the id property of the feature'
        );
      }
    );
  });
});

describe('getFeature', () => {
  test('works', () => {
    datasets.getFeature({ datasetId: 'mock-dataset', featureId: 'foo' });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId/:datasetId/features/:featureId',
      method: 'GET',
      params: {
        datasetId: 'mock-dataset',
        featureId: 'foo'
      }
    });
  });
});

describe('deleteFeature', () => {
  test('works', () => {
    datasets.deleteFeature({ datasetId: 'mock-dataset', featureId: 'foo' });
    expect(tu.requestConfig(datasets)).toEqual({
      path: '/datasets/v1/:ownerId/:datasetId/features/:featureId',
      method: 'DELETE',
      params: {
        datasetId: 'mock-dataset',
        featureId: 'foo'
      }
    });
  });
});
