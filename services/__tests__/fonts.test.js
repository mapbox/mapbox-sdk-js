'use strict';

const fontsService = require('../fonts');
const tu = require('../../test/test-utils');

let fonts;
beforeEach(() => {
  fonts = fontsService(tu.mockClient());
});

describe('getFontGlyphRange', () => {
  test('with one font', () => {
    fonts.getFontGlyphRange({
      fonts: 'Ubuntu Bold',
      start: 0,
      end: 255
    });
    expect(tu.requestConfig(fonts)).toEqual({
      path: '/fonts/v1/:ownerId/:fontList/:fileName',
      method: 'GET',
      params: {
        fontList: ['Ubuntu Bold'],
        fileName: '0-255.pbf'
      },
      encoding: 'binary'
    });
  });

  test('with multiple fonts', () => {
    fonts.getFontGlyphRange({
      fonts: ['Ubuntu Bold', 'Ubuntu Light'],
      start: 0,
      end: 255
    });
    expect(tu.requestConfig(fonts)).toEqual({
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

describe('listFonts', () => {
  test('works', () => {
    fonts.listFonts();
    expect(tu.requestConfig(fonts)).toEqual({
      path: '/fonts/v1/:ownerId',
      method: 'GET',
      params: {}
    });
  });
});

describe('createFont', () => {
  test('works', () => {
    fonts.createFont({
      file: 'path/to/file.ttf'
    });
    expect(tu.requestConfig(fonts)).toEqual({
      path: '/fonts/v1/:ownerId',
      method: 'POST',
      params: {},
      file: 'path/to/file.ttf'
    });
  });
});

describe('deleteFont', () => {
  test('works', () => {
    fonts.deleteFont({ font: 'Custom Font Regular' });
    expect(tu.requestConfig(fonts)).toEqual({
      path: '/fonts/v1/:ownerId/:font',
      method: 'DELETE',
      params: { font: 'Custom Font Regular' }
    });
  });
});

describe('getFontMetadata', () => {
  test('works', () => {
    fonts.getFontMetadata({ font: 'Custom Font Regular' });
    expect(tu.requestConfig(fonts)).toEqual({
      path: '/fonts/v1/:ownerId/:font/metadata',
      method: 'GET',
      params: { font: 'Custom Font Regular' }
    });
  });
});

describe('updateFontMetadata', () => {
  test('works', () => {
    fonts.updateFontMetadata({
      font: 'Custom Font Regular',
      metadata: { visibility: 'public' }
    });
    expect(tu.requestConfig(fonts)).toEqual({
      path: '/fonts/v1/:ownerId/:font/metadata',
      method: 'PATCH',
      params: { font: 'Custom Font Regular' },
      body: { visibility: 'public' }
    });
  });
});
