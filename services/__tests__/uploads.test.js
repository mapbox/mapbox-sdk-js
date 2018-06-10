'use strict';

const uploadsService = require('../uploads');
const tu = require('../../test/test-utils');

let uploads;
beforeEach(() => {
  uploads = uploadsService(tu.mockClient());
});

describe('listUploads', () => {
  test('works', () => {
    uploads.listUploads();
    expect(tu.requestConfig(uploads)).toEqual({
      path: '/uploads/v1/:ownerId',
      method: 'GET',
      params: undefined
    });
  });
});

describe('createUploadCredentials', () => {
  test('works', () => {
    uploads.createUploadCredentials({});
    expect(tu.requestConfig(uploads)).toEqual({
      path: '/uploads/v1/:ownerId/credentials',
      method: 'POST',
      body: undefined
    });
  });
});

describe('createUpload', () => {
  test('works', () => {
    uploads.createUpload({
      mapId: 'tilted_towers',
      url: 'mapbox://datasets/kushan2020/cio5g309a004eusknialll02g',
      tilesetName: 'dusty_devote'
    });
    expect(tu.requestConfig(uploads)).toEqual({
      path: '/uploads/v1/:ownerId',
      method: 'POST',
      body: {
        tileset: 'tilted_towers',
        url: 'mapbox://datasets/kushan2020/cio5g309a004eusknialll02g',
        name: 'dusty_devote'
      }
    });
  });
});

describe('getUpload', () => {
  test('works', () => {
    uploads.getUpload({ uploadId: 'ulpod' });
    expect(tu.requestConfig(uploads)).toEqual({
      path: '/uploads/v1/:ownerId/:uploadId',
      method: 'GET',
      params: {
        uploadId: 'ulpod'
      }
    });
  });
});

describe('removeUpload', () => {
  test('works', () => {
    uploads.deleteUpload({
      uploadId: 'ulpod'
    });
    expect(tu.requestConfig(uploads)).toEqual({
      path: '/uploads/v1/:ownerId/:uploadId',
      method: 'DELETE',
      params: {
        uploadId: 'ulpod'
      }
    });
  });
});
