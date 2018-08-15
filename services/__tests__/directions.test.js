'use strict';

const directionsService = require('../directions');
const tu = require('../../test/test-utils');

let directions;
beforeEach(() => {
  directions = directionsService(tu.mockClient());
});

describe('getDirections', () => {
  test('works', () => {
    directions.getDirections({
      waypoints: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        }
      ]
    });
    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'driving'
      },
      query: {}
    });
  });

  test('it omits queries not supplied', () => {
    directions.getDirections({
      waypoints: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        }
      ],
      profile: 'walking',
      alternatives: false,
      geometries: 'polyline'
    });
    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        alternatives: 'false',
        geometries: 'polyline'
      }
    });
  });

  test('it reads waypoints props', () => {
    directions.getDirections({
      waypoints: [
        {
          coordinates: [2.2, 1.1],
          radius: 2000,
          bearing: [45, 20]
        },
        {
          coordinates: [2.2, 1.1],
          radius: 2000,
          bearing: [46, 21]
        }
      ],
      profile: 'walking',
      steps: false,
      continueStraight: false
    });
    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        steps: 'false',
        continue_straight: 'false',
        radiuses: '2000;2000',
        bearings: '45,20;46,21'
      }
    });
  });

  test('it works if an optional waypoints.bearing is missing at some places', () => {
    directions.getDirections({
      waypoints: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1],
          bearing: [45, 32]
        },
        {
          coordinates: [2.2, 1.1]
        }
      ],
      profile: 'walking',
      steps: false,
      continueStraight: false
    });
    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        steps: 'false',
        continue_straight: 'false',
        bearings: ';;45,32;'
      }
    });
  });

  test('it works if an optional waypoints.radius is missing at some places', () => {
    directions.getDirections({
      waypoints: [
        {
          coordinates: [2.2, 1.1],
          radius: 2000
        },
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1],
          bearing: [45, 32]
        },
        {
          coordinates: [2.2, 1.1]
        }
      ],
      profile: 'walking',
      steps: false,
      continueStraight: false
    });
    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        steps: 'false',
        continue_straight: 'false',
        bearings: ';;45,32;',
        radiuses: '2000;;;'
      }
    });
  });

  test('waypoints.radius can be any of string or number', () => {
    directions.getDirections({
      waypoints: [
        {
          coordinates: [2.2, 1.1],
          radius: 2000
        },
        {
          coordinates: [2.2, 1.1],
          radius: 'unlimited'
        }
      ]
    });

    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'driving'
      },
      query: {
        radiuses: '2000;unlimited'
      }
    });
  });

  test('errors if there are too few waypoints', () => {
    expect(() => {
      directions.getDirections({
        waypoints: [
          {
            coordinates: [2.2, 1.1],
            radius: 2000
          }
        ]
      });
    }).toThrowError(/between 2 and 25/);
  });

  test('errors if there are too many waypoints', () => {
    expect(() => {
      const waypoints = [];
      for (let i = 0; i < 26; i++) {
        waypoints.push({
          coordinates: [2.2, 1.1],
          radius: 2000
        });
      }
      directions.getDirections({
        waypoints
      });
    }).toThrowError(/between 2 and 25/);
  });
});
