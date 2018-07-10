'use strict';

const optimizationService = require('../optimization');
const tu = require('../../test/test-utils');

let optimization;
beforeEach(() => {
  optimization = optimizationService(tu.mockClient());
});

describe('getOptimization', () => {
  test('works', () => {
    optimization.getOptimization({
      waypoints: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        }
      ]
    });
    expect(tu.requestConfig(optimization)).toEqual({
      path: '/optimized-trips/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'driving'
      },
      query: {}
    });
  });

  test('No queries are added that the user has not supplied', () => {
    optimization.getOptimization({
      waypoints: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        }
      ],
      profile: 'walking',
      geometries: 'polyline'
    });
    expect(tu.requestConfig(optimization)).toEqual({
      path: '/optimized-trips/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        geometries: 'polyline'
      }
    });
  });

  test('it reads waypoints props', () => {
    optimization.getOptimization({
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
      steps: false
    });
    expect(tu.requestConfig(optimization)).toEqual({
      path: '/optimized-trips/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        steps: 'false',
        radiuses: '2000;2000',
        bearings: '45,20;46,21'
      }
    });
  });

  test('errors if too few waypoints are provided', () => {
    tu.expectError(
      () => {
        optimization.getOptimization({
          waypoints: [
            {
              coordinates: [2.2, 1.1]
            }
          ],
          profile: 'walking'
        });
      },
      error => {
        expect(error.message).toMatch(
          'waypoints must include between 2 and 12 OptimizationWaypoints'
        );
      }
    );
  });

  test('it works if an optional waypoints.bearing is missing at some places', () => {
    optimization.getOptimization({
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
      steps: false
    });
    expect(tu.requestConfig(optimization)).toEqual({
      path: '/optimized-trips/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        steps: 'false',
        bearings: ';;45,32;'
      }
    });
  });

  test('it works if an optional waypoints.radius is missing at some places', () => {
    optimization.getOptimization({
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
      steps: false
    });
    expect(tu.requestConfig(optimization)).toEqual({
      path: '/optimized-trips/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        steps: 'false',
        bearings: ';;45,32;',
        radiuses: '2000;;;'
      }
    });
  });

  test('waypoints.radius can be "unlimited" or a number', () => {
    optimization.getOptimization({
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

    expect(tu.requestConfig(optimization)).toEqual({
      path: '/optimized-trips/v1/mapbox/:profile/:coordinates',
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

  test('distributions are formatted into semicolon-separated list of comma-separated number pairs', () => {
    optimization.getOptimization({
      waypoints: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        }
      ],
      profile: 'driving',
      distributions: [
        {
          pickup: 0,
          dropoff: 1
        },
        {
          pickup: 2,
          dropoff: 3
        }
      ]
    });
    expect(tu.requestConfig(optimization)).toEqual({
      path: '/optimized-trips/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;2.2,1.1;2.2,1.1',
        profile: 'driving'
      },
      query: {
        distributions: '0,1;2,3'
      }
    });
  });
});
