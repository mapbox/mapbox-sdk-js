'use strict';

const tokensService = require('../tokens');
const tu = require('../../test/test-utils');

let tokens;
beforeEach(() => {
  tokens = tokensService(tu.mockClient());
});

describe('listTokens', () => {
  test('works', () => {
    tokens.listTokens();
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2/:ownerId',
      method: 'GET',
      params: undefined
    });
  });
});

describe('createToken', () => {
  test('works', () => {
    tokens.createToken();
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2/:ownerId',
      params: {},
      method: 'POST',
      body: { scopes: [] }
    });
  });

  test('with scopes', () => {
    tokens.createToken({ scopes: ['styles:read', 'styles:write'] });
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2/:ownerId',
      params: {},
      method: 'POST',
      body: { scopes: ['styles:read', 'styles:write'] }
    });
  });

  test('with all options', () => {
    tokens.createToken({
      scopes: ['styles:list'],
      note: 'horseleg',
      resources: ['one', 'two']
    });
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2/:ownerId',
      method: 'POST',
      params: {},
      body: {
        scopes: ['styles:list'],
        note: 'horseleg',
        resources: ['one', 'two']
      }
    });
  });
});

describe('createTemporaryToken', () => {
  test('with UTC date string', () => {
    tokens.createTemporaryToken({
      expires: '2018-05-22T03:04:16.721Z',
      scopes: ['styles:read']
    });
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2/:ownerId',
      method: 'POST',
      body: {
        expires: '2018-05-22T03:04:16.721Z',
        scopes: ['styles:read']
      },
      params: {}
    });
  });

  test('with Date object', () => {
    const date = new Date(1526958256721);
    tokens.createTemporaryToken({
      expires: date,
      scopes: ['styles:read']
    });
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2/:ownerId',
      method: 'POST',
      body: {
        expires: '2018-05-22T03:04:16.721Z',
        scopes: ['styles:read']
      },
      params: {}
    });
  });
});

describe('updateToken', () => {
  test('works', () => {
    tokens.updateToken({ tokenId: 'foo' });
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2/:ownerId/:tokenId',
      params: { tokenId: 'foo' },
      method: 'PATCH',
      body: {}
    });
  });

  test('with scopes', () => {
    tokens.updateToken({
      tokenId: 'foo',
      scopes: ['styles:read', 'styles:write']
    });
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2/:ownerId/:tokenId',
      params: { tokenId: 'foo' },
      method: 'PATCH',
      body: { scopes: ['styles:read', 'styles:write'] }
    });
  });

  test('with all options', () => {
    tokens.updateToken({
      tokenId: 'foo',
      scopes: ['styles:list'],
      note: 'horseleg',
      resources: ['one', 'two']
    });
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2/:ownerId/:tokenId',
      params: { tokenId: 'foo' },
      method: 'PATCH',
      body: {
        scopes: ['styles:list'],
        note: 'horseleg',
        resources: ['one', 'two']
      }
    });
  });
});

describe('deleteToken', () => {
  test('works', () => {
    tokens.deleteToken({ tokenId: 'foo' });
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2/:ownerId/:tokenId',
      method: 'DELETE',
      params: { tokenId: 'foo' }
    });
  });
});

describe('getToken', () => {
  test('works', () => {
    tokens.getToken();
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/tokens/v2',
      method: 'GET'
    });
  });
});

describe('listScopes', () => {
  test('works', () => {
    tokens.listScopes();
    expect(tu.requestConfig(tokens)).toEqual({
      path: '/scopes/v1/:ownerId',
      method: 'GET',
      params: undefined
    });
  });
});
