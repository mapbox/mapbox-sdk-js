'use strict';

const parseHeaders = require('../parse-headers');

test('works', () => {
  const raw = `date: Fri, 08 Dec 2017 21:04:30 GMT
content-encoding: gzip
x-content-type-options: nosniff
  server: meinheld/0.6.1
x-frame-options: DENY
content-type: text/html; charset=utf-8
      connection: keep-alive


strict-transport-security: max-age=63072000
vary: Cookie, Accept-Encoding
content-length: 6502
x-xss-protection: 1; mode=block`;

  expect(parseHeaders(raw)).toEqual({
    connection: 'keep-alive',
    'content-encoding': 'gzip',
    'content-length': '6502',
    'content-type': 'text/html; charset=utf-8',
    date: 'Fri, 08 Dec 2017 21:04:30 GMT',
    server: 'meinheld/0.6.1',
    'strict-transport-security': 'max-age=63072000',
    vary: 'Cookie, Accept-Encoding',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'x-xss-protection': '1; mode=block'
  });
});

test('given empty input, returns empty object', () => {
  expect(parseHeaders()).toEqual({});
  expect(parseHeaders(undefined)).toEqual({});
  expect(parseHeaders(null)).toEqual({});
  expect(parseHeaders('')).toEqual({});
});
