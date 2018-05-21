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
      way_points: [
        {
          latitude: 1.1,
          longitude: 2.2
        },
        {
          latitude: 1.1,
          longitude: 2.2
        }
      ]
    });
    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/:profile/:coordinates',
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
      way_points: [
        {
          latitude: 1.1,
          longitude: 2.2
        },
        {
          latitude: 1.1,
          longitude: 2.2
        }
      ],
      profile: 'walking',
      alternatives: false,
      geometries: 'polyline'
    });
    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        alternatives: false,
        geometries: 'polyline'
      }
    });
  });

  test('it reads way_points props', () => {
    directions.getDirections({
      way_points: [
        {
          latitude: 1.1,
          longitude: 2.2,
          radius: 2000,
          bearing: [45, 20]
        },
        {
          latitude: 1.1,
          longitude: 2.2,
          radius: 2000,
          bearing: [46, 21]
        }
      ],
      profile: 'walking',
      steps: false,
      continue_straight: false
    });
    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        steps: false,
        continue_straight: false,
        radius: '2000;2000',
        bearing: '45,20;46,21'
      }
    });
  });

  test(`it works if an optional way_points.bearing is missing at some places`, () => {
    directions.getDirections({
      way_points: [
        {
          latitude: 1.1,
          longitude: 2.2
        },
        {
          latitude: 1.1,
          longitude: 2.2
        },
        {
          latitude: 1.1,
          longitude: 2.2,
          bearing: [45, 32]
        },
        {
          latitude: 1.1,
          longitude: 2.2
        }
      ],
      profile: 'walking',
      steps: false,
      continue_straight: false
    });
    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        steps: false,
        continue_straight: false,
        bearing: ';;45,32;'
      }
    });
  });

  test(`it works if an optional way_points.radius is missing at some places`, () => {
    directions.getDirections({
      way_points: [
        {
          latitude: 1.1,
          longitude: 2.2,
          radius: 2000
        },
        {
          latitude: 1.1,
          longitude: 2.2
        },
        {
          latitude: 1.1,
          longitude: 2.2,
          bearing: [45, 32]
        },
        {
          latitude: 1.1,
          longitude: 2.2
        }
      ],
      profile: 'walking',
      steps: false,
      continue_straight: false
    });
    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;2.2,1.1;2.2,1.1',
        profile: 'walking'
      },
      query: {
        steps: false,
        continue_straight: false,
        bearing: ';;45,32;',
        radius: '2000;;;'
      }
    });
  });

  test('way_points.radius can be any of string or number', () => {
    directions.getDirections({
      way_points: [
        {
          latitude: 1.1,
          longitude: 2.2,
          radius: 2000
        },
        {
          latitude: 1.1,
          longitude: 2.2,
          radius: 'unlimited'
        }
      ]
    });

    expect(tu.requestConfig(directions)).toEqual({
      path: '/directions/v5/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'driving'
      },
      query: {
        radius: '2000;unlimited'
      }
    });
  });
});
