'use strict';

const stylesService = require('../styles');
const tu = require('../../test/test-utils');

let styles;
beforeEach(() => {
  styles = stylesService(tu.mockClient());
});

describe('getStyle', () => {
  test('works', () => {
    styles.getStyle({ styleId: 'foo' });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId',
      method: 'GET',
      params: { styleId: 'foo' },
      query: {}
    });
  });

  test('passes through metadata query param', () => {
    styles.getStyle({ styleId: 'foo', metadata: true });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId',
      method: 'GET',
      params: { styleId: 'foo' },
      query: { metadata: true }
    });
  });

  test('draft works', () => {
    styles.getStyle({ styleId: 'foo', draft: true });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/draft',
      method: 'GET',
      params: { styleId: 'foo' },
      query: {}
    });
  });
});

describe('createStyle', () => {
  test('works', () => {
    styles.createStyle({ style: { foo: 'bar' } });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId',
      method: 'POST',
      params: {},
      body: { foo: 'bar' }
    });
  });
});

describe('updateStyle', () => {
  test('works', () => {
    styles.updateStyle({
      styleId: 'syrup',
      style: { foo: 'bar' }
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId',
      method: 'PATCH',
      params: { styleId: 'syrup' },
      body: { foo: 'bar' },
      headers: {}
    });
  });

  test('with lastKnownModification number', () => {
    styles.updateStyle({
      styleId: 'syrup',
      style: { foo: 'bar' },
      lastKnownModification: 1523570269834
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId',
      method: 'PATCH',
      params: { styleId: 'syrup' },
      body: { foo: 'bar' },
      headers: {
        'If-Unmodified-Since': 'Thu, 12 Apr 2018 21:57:49 GMT'
      }
    });
  });

  test('with lastKnownModification string', () => {
    styles.updateStyle({
      styleId: 'syrup',
      style: { foo: 'bar' },
      lastKnownModification: '2018-04-12T21:57:49.834Z'
    });
    expect(tu.requestConfig(styles)).toHaveProperty('headers', {
      'If-Unmodified-Since': 'Thu, 12 Apr 2018 21:57:49 GMT'
    });
  });

  test('with lastKnownModification Date', () => {
    const mod = new Date(1523570269834);
    styles.updateStyle({
      styleId: 'syrup',
      style: { foo: 'bar' },
      lastKnownModification: mod
    });
    expect(tu.requestConfig(styles)).toHaveProperty('headers', {
      'If-Unmodified-Since': 'Thu, 12 Apr 2018 21:57:49 GMT'
    });
  });
});

describe('deleteStyle', () => {
  test('works', () => {
    styles.deleteStyle({ styleId: 'foo' });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId',
      method: 'DELETE',
      params: { styleId: 'foo' }
    });
  });
});

describe('listStyles', () => {
  test('works', () => {
    styles.listStyles();
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId',
      method: 'GET',
      params: {},
      query: {}
    });
  });

  test('with start id', () => {
    styles.listStyles({ start: 'magnet' });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId',
      method: 'GET',
      params: {},
      query: { start: 'magnet' }
    });
  });

  test('with options', () => {
    styles.listStyles({ fresh: true });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId',
      method: 'GET',
      params: {},
      query: { fresh: 'true' }
    });
  });
});

describe('putStyleIcon', () => {
  test('works', () => {
    styles.putStyleIcon({
      styleId: 'foo',
      iconId: 'bar',
      file: 'path/to/file.svg'
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/sprite/:iconId',
      method: 'PUT',
      params: { styleId: 'foo', iconId: 'bar' },
      file: 'path/to/file.svg'
    });
  });
});

describe('deleteStyleIcon', () => {
  test('works', () => {
    styles.deleteStyleIcon({
      styleId: 'foo',
      iconId: 'bar'
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/sprite/:iconId',
      method: 'DELETE',
      params: { styleId: 'foo', iconId: 'bar' }
    });
  });
});

describe('getStyleSprite', () => {
  test('fetches JSON by default', () => {
    styles.getStyleSprite({
      styleId: 'foo'
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/sprite.json',
      method: 'GET',
      params: {
        styleId: 'foo'
      },
      query: {}
    });
  });

  test('high resolution JSON', () => {
    styles.getStyleSprite({
      format: 'json',
      styleId: 'foo',
      highRes: true
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/sprite@2x.json',
      method: 'GET',
      params: {
        styleId: 'foo'
      },
      query: {}
    });
  });

  test('regular resolution PNG', () => {
    styles.getStyleSprite({
      format: 'png',
      styleId: 'foo'
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/sprite.png',
      method: 'GET',
      params: {
        styleId: 'foo'
      },
      query: {},
      encoding: 'binary'
    });
  });

  test('high resolution PNG', () => {
    styles.getStyleSprite({
      format: 'png',
      styleId: 'foo',
      highRes: true
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/sprite@2x.png',
      method: 'GET',
      params: {
        styleId: 'foo'
      },
      query: {},
      encoding: 'binary'
    });
  });

  test('fetches draft JSON by default', () => {
    styles.getStyleSprite({
      styleId: 'foo',
      draft: true
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/draft/sprite.json',
      method: 'GET',
      params: {
        styleId: 'foo'
      },
      query: {}
    });
  });

  test('fetches fresh', () => {
    styles.getStyleSprite({
      styleId: 'foo',
      fresh: true
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/sprite.json',
      method: 'GET',
      params: {
        styleId: 'foo'
      },
      query: {
        fresh: 'true'
      }
    });
  });
});

describe('getFontGlyphRange', () => {
  test('with one font', () => {
    styles.getFontGlyphRange({
      fonts: 'Ubuntu Bold',
      start: 0,
      end: 255
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/fonts/v1/:ownerId/:fontList/:fileName',
      method: 'GET',
      params: {
        fontList: ['Ubuntu Bold'],
        fileName: '0-255.pbf'
      },
      encoding: 'binary'
    });
  });

  test('with multiple font', () => {
    styles.getFontGlyphRange({
      fonts: ['Ubuntu Bold', 'Ubuntu Light'],
      start: 0,
      end: 255
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/fonts/v1/:ownerId/:fontList/:fileName',
      method: 'GET',
      params: {
        fontList: ['Ubuntu Bold', 'Ubuntu Light'],
        fileName: '0-255.pbf'
      },
      encoding: 'binary'
    });
  });
});

describe('getEmbeddableHtml', () => {
  test('works', () => {
    styles.getEmbeddableHtml({
      styleId: 'foo'
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/foo.html',
      method: 'GET',
      params: {},
      query: {}
    });
  });

  test('draft works', () => {
    styles.getEmbeddableHtml({
      styleId: 'foo',
      draft: true
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/foo/draft.html',
      method: 'GET',
      params: {},
      query: {}
    });
  });

  test('with non-default scrollZoom and title', () => {
    styles.getEmbeddableHtml({
      styleId: 'foo',
      scrollZoom: false,
      title: true
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/foo.html',
      method: 'GET',
      params: {},
      query: { zoomwheel: 'false', title: 'true' }
    });
  });

  test('with non-default fallback', () => {
    styles.getEmbeddableHtml({
      styleId: 'foo',
      fallback: true
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/foo.html',
      method: 'GET',
      params: {},
      query: { fallback: 'true' }
    });
  });

  test('with non-default mapboxGL and geocoder versions', () => {
    styles.getEmbeddableHtml({
      styleId: 'foo',
      mapboxGLVersion: '1.10.1',
      mapboxGLGeocoderVersion: '1.0.0'
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/foo.html',
      method: 'GET',
      params: {},
      query: { mapboxGLVersion: '1.10.1', mapboxGLGeocoderVersion: '1.0.0' }
    });
  });
});
