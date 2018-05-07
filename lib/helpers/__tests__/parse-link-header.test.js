'use strict';

// Tests mirror tests in https://github.com/thlorenz/parse-link-header
const parseLinkHeader = require('../parse-link-header');

test('parsing a proper link header with next and last', () => {
  const link =
    '<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100>; rel="next", ' +
    '<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100>; rel="last"';

  expect(parseLinkHeader(link)).toEqual({
    next: {
      url:
        'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100',
      params: {}
    },
    last: {
      url:
        'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100',
      params: {}
    }
  });
});

test('handles unquoted relationships', () => {
  const link =
    '<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100>; rel=next, ' +
    '<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100>; rel=last';

  expect(parseLinkHeader(link)).toEqual({
    next: {
      params: {},
      url:
        'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100'
    },
    last: {
      params: {},
      url:
        'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100'
    }
  });
});

test('parsing a proper link header with next, prev and last', () => {
  const linkHeader =
    '<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next", ' +
    '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="prev", ' +
    '<https://api.github.com/user/9287/repos?page=5&per_page=100>; rel="last"';

  expect(parseLinkHeader(linkHeader)).toEqual({
    next: {
      params: {},
      url: 'https://api.github.com/user/9287/repos?page=3&per_page=100'
    },
    prev: {
      params: {},
      url: 'https://api.github.com/user/9287/repos?page=1&per_page=100'
    },
    last: {
      params: {},
      url: 'https://api.github.com/user/9287/repos?page=5&per_page=100'
    }
  });
});

test('parsing an empty link header', () => {
  const linkHeader = '';
  expect(parseLinkHeader(linkHeader)).toEqual({});
});

test('parsing a proper link header with next and a link without rel', () => {
  const linkHeader =
    '<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next", ' +
    '<https://api.github.com/user/9287/repos?page=1&per_page=100>; pet="cat", ';

  expect(parseLinkHeader(linkHeader)).toEqual({
    next: {
      params: {},
      url: 'https://api.github.com/user/9287/repos?page=3&per_page=100'
    }
  });
});

test('parsing a proper link header with next and properties besides rel', () => {
  const linkHeader =
    '<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next"; hello="world"; pet="cat"';

  expect(parseLinkHeader(linkHeader)).toEqual({
    next: {
      params: {
        hello: 'world',
        pet: 'cat'
      },
      url: 'https://api.github.com/user/9287/repos?page=3&per_page=100'
    }
  });
});

test('parsing a proper link header with a comma in the url', () => {
  const linkHeader =
    '<https://imaginary.url.notreal/?name=What,+me+worry>; rel="next";';

  expect(parseLinkHeader(linkHeader)).toEqual({
    next: {
      params: {},
      url: 'https://imaginary.url.notreal/?name=What,+me+worry'
    }
  });
});

test('parsing a proper link header with a multi-word rel', () => {
  const linkHeader =
    '<https://imaginary.url.notreal/?name=What,+me+worry>; rel="next page";';

  expect(parseLinkHeader(linkHeader)).toEqual({
    next: {
      params: {},
      url: 'https://imaginary.url.notreal/?name=What,+me+worry'
    },
    page: {
      params: {},
      url: 'https://imaginary.url.notreal/?name=What,+me+worry'
    }
  });
});

test('parsing a proper link header with matrix parameters', () => {
  const linkHeader =
    '<https://imaginary.url.notreal/segment;foo=bar;baz/item?name=What,+me+worry>; rel="next";';

  expect(parseLinkHeader(linkHeader)).toEqual({
    next: {
      params: {},
      url:
        'https://imaginary.url.notreal/segment;foo=bar;baz/item?name=What,+me+worry'
    }
  });
});

test('invalid header', () => {
  expect(parseLinkHeader('<;')).toEqual({});
  expect(parseLinkHeader('')).toEqual({});
  expect(parseLinkHeader('<a>;,<7')).toEqual({});
});

test('empty header', () => {
  expect(parseLinkHeader('<>;;')).toEqual({});
});
