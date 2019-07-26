'use strict';

const MapiClient = require('../mapi-client');
const tu = require('../../../test/test-utils');
const constants = require('../../constants');
const mbxStatic = require('../../../services/static');

test('errors without options', () => {
  tu.expectError(
    () => {
      new MapiClient();
    },
    error => {
      expect(error.message).toMatch(/access token/);
    }
  );
});

test('errors without an accessToken option', () => {
  tu.expectError(
    () => {
      new MapiClient({ foo: 'bar' });
    },
    error => {
      expect(error.message).toMatch(/access token/);
    }
  );
});

test('errors with an invalid accessToken', () => {
  tu.expectError(
    () => {
      new MapiClient({ accessToken: 'bar' });
    },
    error => {
      expect(error.message).toMatch(/invalid token/i);
    }
  );
});

test('origin defaults to the standard public origin', () => {
  const client = new MapiClient({ accessToken: tu.mockToken() });
  expect(client.origin).toBe(constants.API_ORIGIN);
});

test('properly adds access token to url() when a service client has token', () => {
  const client = new MapiClient({
    accessToken: tu.mockToken()
  });
  const staticServ = mbxStatic(client);
  expect(staticServ.client.accessToken).toBe(client.accessToken);

  expect(
    staticServ
      .getStaticImage({
        ownerId: 'mapbox',
        styleId: 'streets-v11',
        width: 200,
        height: 300,
        position: {
          coordinates: [12, 13],
          zoom: 4
        }
      })
      .url()
  ).toMatch(client.accessToken);
});

test('properly adds access token to url() when service token is passed in', () => {
  const staticServ = mbxStatic({
    accessToken: tu.mockToken()
  });

  expect(
    staticServ
      .getStaticImage({
        ownerId: 'mapbox',
        styleId: 'streets-v11',
        width: 200,
        height: 300,
        position: {
          coordinates: [12, 13],
          zoom: 4
        }
      })
      .url()
  ).toMatch(staticServ.client.accessToken);
});
