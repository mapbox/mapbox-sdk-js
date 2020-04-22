'use strict';

const urlUtils = require('../url-utils');

const {
  appendQueryParam,
  appendQueryObject,
  prependOrigin,
  interpolateRouteParams
} = urlUtils;

describe('appendQueryParam', () => {
  test('appends when no search exists in source URL', () => {
    expect(appendQueryParam('foo', 'bar', 'baz')).toBe('foo?bar=baz');
  });

  test('appends when one search param exists in source URL', () => {
    expect(appendQueryParam('foo?bar=baz', 'cat', 'cyrus')).toBe(
      'foo?bar=baz&cat=cyrus'
    );
  });

  test('appends when three search params exist in source URL', () => {
    expect(
      appendQueryParam(
        'foo?bar=baz&cat=cyrus&dog=penny&horse=ed',
        'mouse',
        'peter'
      )
    ).toBe('foo?bar=baz&cat=cyrus&dog=penny&horse=ed&mouse=peter');
  });

  test('encodes everything except commas separating items in array values', () => {
    expect(appendQueryParam('foo', '#bar', ['a?', 'b,d', 'c&'])).toBe(
      'foo?%23bar=a%3F,b%2Cd,c%26'
    );
  });
});

describe('appendQueryObject', () => {
  test('returns same URL if query is empty', () => {
    expect(appendQueryObject('/foo/bar')).toBe('/foo/bar');
  });

  test('attaches new query after existing query', () => {
    expect(
      appendQueryObject('/foo/bar?one=1', {
        two: 2,
        three: 3
      })
    ).toBe('/foo/bar?one=1&two=2&three=3');
  });

  test('handles primitives', () => {
    expect(
      appendQueryObject('/foo/bar', {
        one: 1,
        two: 2,
        three: '3',
        four: true,
        five: false
      })
    ).toBe('/foo/bar?one=1&two=2&three=3&four');
  });

  test('turns arrays into comma lists', () => {
    expect(
      appendQueryObject('/foo/bar', {
        test: ['one', 'two']
      })
    ).toBe('/foo/bar?test=one%2Ctwo');
  });

  test('handles arrays with zero values correctly', () => {
    expect(
      appendQueryObject('/geocoding/v5/mapbox.places/berlin.json', {
        proximity: [0, 51.5]
      })
    ).toBe('/geocoding/v5/mapbox.places/berlin.json?proximity=0%2C51.5');
  });

  test('skips undefined properties', () => {
    expect(
      appendQueryObject('/foo/bar', {
        one: undefined,
        two: 2
      })
    ).toBe('/foo/bar?two=2');
  });
});

describe('prependOrigin', () => {
  test('returns original if no origin is provided', () => {
    expect(prependOrigin('foo/bar')).toBe('foo/bar');
  });

  test('does not replace origin if one was already there', () => {
    expect(
      prependOrigin('http://www.first.com/foo/bar', 'https://second.com')
    ).toBe('http://www.first.com/foo/bar');
  });

  test('always ends up with just one slash between the origin and the path', () => {
    expect(prependOrigin('foo/bar', 'https://test.com/')).toBe(
      'https://test.com/foo/bar'
    );
    expect(prependOrigin('/foo/bar', 'https://test.com/')).toBe(
      'https://test.com/foo/bar'
    );
    expect(prependOrigin('/foo/bar', 'https://test.com')).toBe(
      'https://test.com/foo/bar'
    );
    expect(prependOrigin('foo/bar', 'https://test.com')).toBe(
      'https://test.com/foo/bar'
    );
  });
});

describe('interpolateRouteParams', () => {
  test('returns route if no params are provided', () => {
    expect(interpolateRouteParams('/foo/bar')).toBe('/foo/bar');
  });

  test('encodes all values except commas separating items in array values', () => {
    expect(
      interpolateRouteParams('/foo/:a/:b/:c', {
        a: '#bar',
        b: ['a?', 'c&'],
        c: 'b,d'
      })
    ).toBe('/foo/%23bar/a%3F,c%26/b%2Cd');
  });

  test('can interpolate filenames before extensions', () => {
    expect(
      interpolateRouteParams('/foo/:a.json', {
        a: ['1', '2']
      })
    ).toBe('/foo/1,2.json');
  });
});
