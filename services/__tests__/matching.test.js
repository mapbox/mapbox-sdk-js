'use strict';

const matchingService = require('../matching');
const tu = require('../../test/test-utils');

let matching;
beforeEach(() => {
  matching = matchingService(tu.mockClient());
});

function urlEncodeBody(body) {
  return body
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
}

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
      path: '/matching/v5/mapbox/:profile',
      method: 'POST',
      body: urlEncodeBody([['coordinates', '2.2,1.1;2.2,1.1']]),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      params: { profile: 'driving' }
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
      path: '/matching/v5/mapbox/:profile',
      method: 'POST',
      body: urlEncodeBody([
        ['geometries', 'polyline6'],
        ['tidy', 'true'],
        ['waypoints', '0;;2;3'],
        ['coordinates', '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1']
      ]),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      params: { profile: 'walking' }
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
      path: '/matching/v5/mapbox/:profile',
      method: 'POST',
      body: urlEncodeBody([
        ['steps', 'false'],
        ['waypoints', '0;;;3'],
        ['coordinates', '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1']
      ]),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      params: { profile: 'walking' }
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
        ['waypoints', '0;1;;3'],
        ['timestamps', ';;0;'],
        ['waypoint_names', ';;special;'],
        ['coordinates', '2.2,1.1;2.2,1.1;2.2,1.1;2.2,1.1']
      ])
    });
  });
});
