'use strict';

const matrixService = require('../matrix');
const tu = require('../../test/test-utils');

let matrix;
beforeEach(() => {
  matrix = matrixService(tu.mockClient());
});

describe('getMatrix', () => {
  test('works', () => {
    matrix.getMatrix({
      points: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        }
      ]
    });
    expect(tu.requestConfig(matrix)).toEqual({
      path: '/directions-matrix/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1',
        profile: 'driving'
      },
      query: {}
    });
  });

  test('it understands approach', () => {
    matrix.getMatrix({
      points: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1],
          approach: 'curb'
        },
        {
          coordinates: [3.2, 1.1]
        },
        {
          coordinates: [4.2, 1.1]
        }
      ],
      profile: 'walking'
    });
    expect(tu.requestConfig(matrix)).toEqual({
      path: '/directions-matrix/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1',
        profile: 'walking'
      },
      query: {
        approaches: ';curb;;'
      }
    });
  });

  test('understands annotations ', () => {
    matrix.getMatrix({
      points: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [3.2, 1.1]
        },
        {
          coordinates: [4.2, 1.1]
        }
      ],
      profile: 'walking',
      annotations: ['distance', 'duration']
    });
    expect(tu.requestConfig(matrix)).toEqual({
      path: '/directions-matrix/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1',
        profile: 'walking'
      },
      query: {
        annotations: 'distance,duration'
      }
    });
  });

  test('handles when sources & destinations are array', () => {
    matrix.getMatrix({
      points: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [3.2, 1.1]
        },
        {
          coordinates: [4.2, 1.1]
        }
      ],
      profile: 'walking',
      sources: [1, 5],
      destinations: [0, 2]
    });
    expect(tu.requestConfig(matrix)).toEqual({
      path: '/directions-matrix/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1',
        profile: 'walking'
      },
      query: {
        destinations: '0;2',
        sources: '1;5'
      }
    });
  });

  test('handles when sources & destinations are `all`', () => {
    matrix.getMatrix({
      points: [
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [2.2, 1.1]
        },
        {
          coordinates: [3.2, 1.1]
        },
        {
          coordinates: [4.2, 1.1]
        }
      ],
      profile: 'walking',
      sources: 'all',
      destinations: 'all'
    });
    expect(tu.requestConfig(matrix)).toEqual({
      path: '/directions-matrix/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '2.2,1.1;2.2,1.1;3.2,1.1;4.2,1.1',
        profile: 'walking'
      },
      query: {
        destinations: 'all',
        sources: 'all'
      }
    });
  });

  test('errors if there are too few points', () => {
    expect(() => {
      matrix.getMatrix({
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
      matrix.getMatrix({
        points
      });
    }).toThrowError(/between 2 and 100/);
  });
});
