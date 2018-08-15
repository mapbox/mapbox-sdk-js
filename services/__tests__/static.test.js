'use strict';

jest.mock('@mapbox/polyline', () => {
  return {
    encode: jest.fn(() => 'mock polyline')
  };
});

const polyline = require('@mapbox/polyline');
const staticService = require('../static');
const tu = require('../../test/test-utils');

let service;
beforeEach(() => {
  var client = tu.mockClient();
  client.origin = 'https://api.mapbox.com';
  client.accessToken = 'pk.xxx';
  service = staticService(client);
});

describe('getStaticImage', () => {
  test('minimal options', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: {
        coordinates: [12, 13],
        zoom: 4
      }
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path: '/styles/v1/:ownerId/:styleId/static/12,13,4/200x300',
      query: {},
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
  });

  test('bearing and pitch', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: {
        coordinates: [12, 13],
        zoom: 3,
        bearing: 80,
        pitch: 30
      }
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path: '/styles/v1/:ownerId/:styleId/static/12,13,3,80,30/200x300',
      query: {},
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
  });

  test('auto position', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: 'auto'
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path: '/styles/v1/:ownerId/:styleId/static/auto/200x300',
      query: {},
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
  });

  test('highRes', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: {
        coordinates: [12, 13],
        zoom: 3
      },
      highRes: true
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path: '/styles/v1/:ownerId/:styleId/static/12,13,3/200x300@2x',
      query: {},
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
  });

  test('without attribution and logo', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: {
        coordinates: [12, 13],
        zoom: 3
      },
      attribution: false,
      logo: false
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path: '/styles/v1/:ownerId/:styleId/static/12,13,3/200x300',
      query: { attribution: 'false', logo: 'false' },
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
  });

  test('with marker overlays', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: {
        coordinates: [12, 13],
        zoom: 3
      },
      overlays: [
        // Simple markers.
        {
          marker: {
            coordinates: [12.2, 12.8]
          }
        },
        {
          marker: {
            size: 'large',
            coordinates: [14, 13.2],
            label: 'm',
            color: '#000'
          }
        },
        {
          marker: {
            coordinates: [15, 15.2],
            label: 'airport',
            color: '#ff0000'
          }
        },
        // Custom marker
        {
          marker: {
            coordinates: [10, 11],
            url:
              'https://upload.wikimedia.org/wikipedia/commons/6/6f/0xff_timetracker.png'
          }
        }
      ]
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path:
        '/styles/v1/:ownerId/:styleId/static/pin-s(12.2,12.8),pin-l-m+000(14,13.2),pin-s-airport+ff0000(15,15.2),url-https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F6%2F6f%2F0xff_timetracker.png(10,11)/12,13,3/200x300',
      query: {},
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
  });

  test('with a marker before a layer', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: {
        coordinates: [12, 13],
        zoom: 3
      },
      overlays: [
        {
          marker: {
            coordinates: [12.2, 12.8]
          }
        }
      ],
      insertOverlayBeforeLayer: 'national_park'
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path:
        '/styles/v1/:ownerId/:styleId/static/pin-s(12.2,12.8)/12,13,3/200x300',
      query: { before_layer: 'national_park' },
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
  });

  test('with GeoJSON line overlay that includes longitude <-180', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: {
        coordinates: [12, 13],
        zoom: 3
      },
      overlays: [
        {
          geoJson: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [11.09619140625, 13.132979019087472],
                [-190.11767578125, 14.392118083661728]
              ]
            }
          }
        }
      ]
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path:
        '/styles/v1/:ownerId/:styleId/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%7D%2C%22geometry%22%3A%7B%22type%22%3A%22LineString%22%2C%22coordinates%22%3A%5B%5B11.09619140625%2C13.132979019087472%5D%2C%5B-190.11767578125%2C14.392118083661728%5D%5D%7D%7D)/12,13,3/200x300',
      query: {},
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
  });

  test('with GeoJSON FeatureCollection overlay', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: {
        coordinates: [12, 13],
        zoom: 3
      },
      overlays: [
        {
          geoJson: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [11.129150390625, 13.742053062720384],
                      [11.05224609375, 13.047372256948787],
                      [12.205810546875, 13.036669323115246],
                      [12.095947265625, 13.69936179848486],
                      [11.129150390625, 13.742053062720384]
                    ]
                  ]
                }
              }
            ]
          }
        }
      ]
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path:
        '/styles/v1/:ownerId/:styleId/static/geojson(%7B%22type%22%3A%22FeatureCollection%22%2C%22features%22%3A%5B%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B11.129150390625%2C13.742053062720384%5D%2C%5B11.05224609375%2C13.047372256948787%5D%2C%5B12.205810546875%2C13.036669323115246%5D%2C%5B12.095947265625%2C13.69936179848486%5D%2C%5B11.129150390625%2C13.742053062720384%5D%5D%5D%7D%7D%5D%7D)/12,13,3/200x300',
      query: {},
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
  });

  test('with simple polyline overlay', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: {
        coordinates: [12, 13],
        zoom: 3
      },
      overlays: [
        {
          path: {
            coordinates: [
              [8.1298828125, 10.098670120603392],
              [9.4921875, 15.792253570362446]
            ]
          }
        }
      ]
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path:
        '/styles/v1/:ownerId/:styleId/static/path(mock%20polyline)/12,13,3/200x300',
      query: {},
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
    expect(polyline.encode).toHaveBeenCalledWith([
      [10.098670120603392, 8.1298828125],
      [15.792253570362446, 9.4921875]
    ]);
  });

  test('with fancy polyline overlay', () => {
    service.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v10',
      width: 200,
      height: 300,
      position: {
        coordinates: [12, 13],
        zoom: 3
      },
      overlays: [
        {
          path: {
            coordinates: [
              [8.1298828125, 10.098670120603392],
              [9.4921875, 15.792253570362446],
              [11.77734375, 14.179186142354181],
              [11.513671874999998, 11.6522364041154]
            ],
            strokeColor: 'ff0000',
            strokeWidth: 10,
            strokeOpacity: 0.4,
            fillColor: '000',
            fillOpacity: 0.75
          }
        }
      ]
    });
    expect(tu.requestConfig(service)).toEqual({
      method: 'GET',
      path:
        '/styles/v1/:ownerId/:styleId/static/path-10+ff0000-0.4+000-0.75(mock%20polyline)/12,13,3/200x300',
      query: {},
      params: { ownerId: 'mapbox', styleId: 'streets-v10' }
    });
    expect(polyline.encode).toHaveBeenCalledWith([
      [10.098670120603392, 8.1298828125],
      [15.792253570362446, 9.4921875],
      [14.179186142354181, 11.77734375],
      [11.6522364041154, 11.513671874999998]
    ]);
  });

  test('catches bad polylines', () => {
    expect(() => {
      service.getStaticImage({
        ownerId: 'mapbox',
        styleId: 'streets-v10',
        width: 200,
        height: 300,
        position: 'auto',
        overlays: [
          {
            path: {
              coordinates: [
                [8.1298828125, 10.098670120603392],
                [9.4921875, 15.792253570362446]
              ],
              strokeOpacity: 0.4
            }
          }
        ]
      });
    }).toThrow(/strokeOpacity requires strokeColor/);

    expect(() => {
      service.getStaticImage({
        ownerId: 'mapbox',
        styleId: 'streets-v10',
        width: 200,
        height: 300,
        position: 'auto',
        overlays: [
          {
            path: {
              coordinates: [
                [8.1298828125, 10.098670120603392],
                [9.4921875, 15.792253570362446]
              ],
              fillColor: '000'
            }
          }
        ]
      });
    }).toThrow(/fillColor requires strokeColor/);
    expect(() => {
      service.getStaticImage({
        ownerId: 'mapbox',
        styleId: 'streets-v10',
        width: 200,
        height: 300,
        position: 'auto',
        overlays: [
          {
            path: {
              coordinates: [
                [8.1298828125, 10.098670120603392],
                [9.4921875, 15.792253570362446]
              ],
              strokeColor: 'ff0000',
              fillOpacity: 0.75
            }
          }
        ]
      });
    }).toThrow(/fillOpacity requires fillColor/);
  });
});
