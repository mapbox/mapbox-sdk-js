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
      params: { styleId: 'foo' }
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
      path: '/styles/v1/:ownerId/:styleId/:fileName',
      method: 'GET',
      params: {
        styleId: 'foo',
        fileName: 'sprite.json'
      }
    });
  });

  test('high resolution JSON', () => {
    styles.getStyleSprite({
      format: 'json',
      styleId: 'foo',
      highRes: true
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/:fileName',
      method: 'GET',
      params: {
        styleId: 'foo',
        fileName: 'sprite@2x.json'
      }
    });
  });

  test('regular resolution PNG', () => {
    styles.getStyleSprite({
      format: 'png',
      styleId: 'foo'
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/:fileName',
      method: 'GET',
      params: {
        styleId: 'foo',
        fileName: 'sprite.png'
      }
    });
  });

  test('high resolution PNG', () => {
    styles.getStyleSprite({
      format: 'png',
      styleId: 'foo',
      highRes: true
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:styleId/:fileName',
      method: 'GET',
      params: {
        styleId: 'foo',
        fileName: 'sprite@2x.png'
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
      }
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
      }
    });
  });
});

describe('getEmbeddableHtml', () => {
  test('works', () => {
    styles.getEmbeddableHtml({
      styleId: 'foo'
    });
    expect(tu.requestConfig(styles)).toEqual({
      path: '/styles/v1/:ownerId/:fileName',
      method: 'GET',
      params: {
        fileName: 'foo.html'
      },
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
      path: '/styles/v1/:ownerId/:fileName',
      method: 'GET',
      params: {
        fileName: 'foo.html'
      },
      query: { zoomwheel: 'false', title: 'true' }
    });
  });
});
