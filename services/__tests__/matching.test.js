'use strict';

const matchingService = require('../matching');
const tu = require('../../test/test-utils');

let matching;
beforeEach(() => {
  matching = matchingService(tu.mockClient());
});

describe('getMatching', () => {
  test('works', () => {
    matching.getMatching({
      matchPath: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        }
      ]
    });
    expect(tu.requestConfig(matching)).toEqual({
      path: '/matching/v5/mapbox/:profile/:coordinates.json',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'driving'
      },
      query: {}
    });
  });

  test('it understands isWaypoint', () => {
    matching.getMatching({
      matchPath: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1],
          isWaypoint: false
        },
        {
          coordinates: [3.2, 1.1]
        },
        {
          coordinates: [4.2, 1.1]
        }
      ],
      profile: 'walking',
      tidy: true,
      geometries: 'polyline6'
    });
    expect(tu.requestConfig(matching)).toEqual({
      path: '/matching/v5/mapbox/:profile/:coordinates.json',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1',
        profile: 'walking'
      },
      query: {
        tidy: true,
        geometries: 'polyline6',
        waypoints: '0;;2;3'
      }
    });
  });

  test('it omits waypoints if all isWaypoints are true', () => {
    matching.getMatching({
      matchPath: [
        {
          coordinates: [2.2, 1.1],
          isWaypoint: true
        },
        {
          coordinates: [2.2, 1.1],
          isWaypoint: true
        },
        {
          coordinates: [3.2, 1.1],
          isWaypoint: true
        },
        {
          coordinates: [4.2, 1.1],
          isWaypoint: true
        }
      ],
      profile: 'walking',
      steps: false
    });
    expect(tu.requestConfig(matching)).toEqual({
      path: '/matching/v5/mapbox/:profile/:coordinates.json',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1',
        profile: 'walking'
      },
      query: {
        steps: false
      }
    });
  });

  test('it always keeps first and last waypoint', () => {
    matching.getMatching({
      matchPath: [
        {
          coordinates: [2.2, 1.1],
          isWaypoint: false
        },
        {
          coordinates: [2.2, 1.1],
          isWaypoint: false
        },
        {
          coordinates: [3.2, 1.1],
          isWaypoint: false
        },
        {
          coordinates: [4.2, 1.1],
          isWaypoint: false
        }
      ],
      profile: 'walking',
      steps: false
    });
    expect(tu.requestConfig(matching)).toEqual({
      path: '/matching/v5/mapbox/:profile/:coordinates.json',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1',
        profile: 'walking'
      },
      query: {
        waypoints: '0;;;3',
        steps: false
      }
    });
  });

  test('it understands other coordinate properties', () => {
    matching.getMatching({
      matchPath: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1],
          approach: 'curb',
          isWaypoint: true
        },
        {
          coordinates: [2.2, 1.1],
          timestamp: 0,
          waypointName: 'special',
          radius: 50,
          isWaypoint: false
        },
        {
          coordinates: [2.2, 1.1],
          approach: 'unrestricted'
        }
      ],
      profile: 'walking',
      steps: true
    });
    expect(tu.requestConfig(matching)).toEqual({
      path: '/matching/v5/mapbox/:profile/:coordinates.json',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        approaches: ';curb;;unrestricted',
        steps: true,
        radiuses: ';;50;',
        waypoint_names: ';;special;',
        waypoints: '0;1;;3',
        timestamps: ';;0;'
      }
    });
  });
});
