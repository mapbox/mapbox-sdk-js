'use strict';

const mapMatchingService = require('../map-matching');
const tu = require('../../test/test-utils');

let mapMatching;
beforeEach(() => {
  mapMatching = mapMatchingService(tu.mockClient());
});

function urlEncodeBody(body) {
  return body
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
}

describe('getMatch', () => {
  test('works', () => {
    mapMatching.getMatch({
      points: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        }
      ]
    });
    expect(tu.requestConfig(mapMatching)).toEqual({
      path: '/matching/v5/mapbox/:profile',
      method: 'POST',
      body: urlEncodeBody([['coordinates', '2.2,1.1;2.2,1.1']]),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      params: { profile: 'driving' }
    });
  });

  test('it understands isWaypoint', () => {
    mapMatching.getMatch({
      points: [
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
    expect(tu.requestConfig(mapMatching)).toEqual({
      path: '/matching/v5/mapbox/:profile',
      method: 'POST',
      body: urlEncodeBody([
        ['geometries', 'polyline6'],
        ['tidy', 'true'],
        ['waypoints', '0;2;3'],
        ['coordinates', '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1']
      ]),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      params: { profile: 'walking' }
    });
  });

  test('it omits waypoints if all isWaypoints are true', () => {
    mapMatching.getMatch({
      points: [
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
    expect(tu.requestConfig(mapMatching)).toEqual({
      path: '/matching/v5/mapbox/:profile',
      method: 'POST',
      body: urlEncodeBody([
        ['steps', 'false'],
        ['coordinates', '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1']
      ]),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      params: { profile: 'walking' }
    });
  });

  test('it always keeps first and last waypoint', () => {
    mapMatching.getMatch({
      points: [
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
    expect(tu.requestConfig(mapMatching)).toEqual({
      path: '/matching/v5/mapbox/:profile',
      method: 'POST',
      body: urlEncodeBody([
        ['steps', 'false'],
        ['waypoints', '0;3'],
        ['coordinates', '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1']
      ]),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      params: { profile: 'walking' }
    });
  });

  test('it understands other coordinate properties', () => {
    mapMatching.getMatch({
      points: [
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
          timestamp: 1528157886576,
          waypointName: 'special',
          radius: 50,
          isWaypoint: false
        },
        {
          coordinates: [2.2, 1.1],
          timestamp: new Date(1528157886888),
          approach: 'unrestricted'
        }
      ],
      profile: 'walking',
      steps: true
    });
    expect(tu.requestConfig(mapMatching)).toEqual({
      path: '/matching/v5/mapbox/:profile',
      method: 'POST',
      params: {
        profile: 'walking'
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: urlEncodeBody([
        ['steps', 'true'],
        ['approaches', ';curb;;unrestricted'],
        ['radiuses', ';;50;'],
        ['waypoints', '0;1;3'],
        ['timestamps', ';;1528157886576;1528157886888'],
        ['waypoint_names', ';;special;'],
        ['coordinates', '2.2,1.1;2.2,1.1;2.2,1.1;2.2,1.1']
      ])
    });
  });

  test('errors if there are too few points', () => {
    expect(() => {
      mapMatching.getMatch({
        points: [{ coordinates: [2.2, 1.1] }]
      });
    }).toThrowError(/between 2 and 100/);
  });

  test('errors if there are too many points', () => {
    expect(() => {
      const points = [];
      for (let i = 0; i < 101; i++) {
        points.push({ coordinates: [2.2, 1.1] });
      }
      mapMatching.getMatch({
        points
      });
    }).toThrowError(/between 2 and 100/);
  });
});
