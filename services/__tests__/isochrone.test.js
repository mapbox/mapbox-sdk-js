'use strict';

const isochroneService = require('../isochrone');
const tu = require('../../test/test-utils');

let isochrone;

beforeEach(() => {
  isochrone = isochroneService(tu.mockClient());
});

describe('getContours', () => {
  test('works', () => {
    isochrone.getContours({
      coordinates: [-118.22258, 33.99038],
      minutes: [5, 10, 15]
    });

    expect(tu.requestConfig(isochrone)).toEqual({
      path: '/isochrone/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '-118.22258,33.99038',
        profile: 'driving'
      },
      query: {
        contours_minutes: '5,10,15'
      }
    });
  });

  test('it omits queries not supplied', () => {
    isochrone.getContours({
      coordinates: [-118.22258, 33.99038],
      minutes: [5, 10, 15],
      profile: 'walking',
      polygons: true
    });

    expect(tu.requestConfig(isochrone)).toEqual({
      path: '/isochrone/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '-118.22258,33.99038',
        profile: 'walking'
      },
      query: {
        contours_minutes: '5,10,15',
        polygons: 'true'
      }
    });
  });

  test('with all config options (minutes)', () => {
    isochrone.getContours({
      coordinates: [-118.22258, 33.99038],
      minutes: [5, 10, 15, 20],
      profile: 'walking',
      polygons: true,
      colors: ['6706ce', '04e813', '4286f4', '555555'],
      denoise: 0,
      generalize: 0
    });

    expect(tu.requestConfig(isochrone)).toEqual({
      path: '/isochrone/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '-118.22258,33.99038',
        profile: 'walking'
      },
      query: {
        contours_minutes: '5,10,15,20',
        polygons: 'true',
        contours_colors: '6706ce,04e813,4286f4,555555',
        denoise: 0,
        generalize: 0
      }
    });
  });

  test('with all config options (meters)', () => {
    isochrone.getContours({
      coordinates: [-118.22258, 33.99038],
      meters: [5000, 10000, 15000, 20000],
      profile: 'walking',
      polygons: true,
      colors: ['6706ce', '04e813', '4286f4', '555555'],
      denoise: 0,
      generalize: 0
    });

    expect(tu.requestConfig(isochrone)).toEqual({
      path: '/isochrone/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '-118.22258,33.99038',
        profile: 'walking'
      },
      query: {
        contours_meters: '5000,10000,15000,20000',
        polygons: 'true',
        contours_colors: '6706ce,04e813,4286f4,555555',
        denoise: 0,
        generalize: 0
      }
    });
  });

  test('hex colors with # are removed', () => {
    isochrone.getContours({
      coordinates: [-118.22258, 33.99038],
      minutes: [5, 10, 15],
      colors: ['#6706ce', '#04e813', '#4286f4']
    });

    expect(tu.requestConfig(isochrone)).toEqual({
      path: '/isochrone/v1/mapbox/:profile/:coordinates',
      method: 'GET',
      params: {
        coordinates: '-118.22258,33.99038',
        profile: 'driving'
      },
      query: {
        contours_minutes: '5,10,15',
        contours_colors: '6706ce,04e813,4286f4'
      }
    });
  });

  test('errors if more than 4 contours_minutes requested', () => {
    expect(() =>
      isochrone.getContours({
        coordinates: [-118.22258, 33.99038],
        minutes: [5, 10, 15, 20, 30]
      })
    ).toThrow('minutes must contain between 1 and 4 contour values');
  });

  test('errors if more than 4 contours_meters requested', () => {
    expect(() =>
      isochrone.getContours({
        coordinates: [-118.22258, 33.99038],
        meters: [5000, 10000, 15000, 20000, 30000]
      })
    ).toThrow('meters must contain between 1 and 4 contour values');
  });

  test('errors if minute value is greater than 60', () => {
    expect(() =>
      isochrone.getContours({
        coordinates: [-118.22258, 33.99038],
        minutes: [40, 50, 60, 70]
      })
    ).toThrow('minutes must be less than 60');
  });

  test('errors if meter value is greater than 100000', () => {
    expect(() =>
      isochrone.getContours({
        coordinates: [-118.22258, 33.99038],
        meters: [10000, 50000, 100000, 100001]
      })
    ).toThrow('meters must be less than 100000');
  });

  test('errors if generalize is less than 0', () => {
    expect(() =>
      isochrone.getContours({
        coordinates: [-118.22258, 33.99038],
        minutes: [40, 50, 60],
        generalize: -1
      })
    ).toThrow('generalize tolerance must be a positive number');
  });

  test('colors should have the same number of entries as minutes', () => {
    expect(() =>
      isochrone.getContours({
        coordinates: [-118.22258, 33.99038],
        minutes: [5, 10, 15, 20],
        profile: 'walking',
        colors: ['6706ce', '04e813']
      })
    ).toThrow('colors should have the same number of entries as minutes');
  });

  test('colors should have the same number of entries as meters', () => {
    expect(() =>
      isochrone.getContours({
        coordinates: [-118.22258, 33.99038],
        meters: [5000, 10000, 15000, 20000],
        profile: 'walking',
        colors: ['6706ce', '04e813']
      })
    ).toThrow('colors should have the same number of entries as meters');
  });

  test('either meters or minutes should be specified', () => {
    expect(() =>
      isochrone.getContours({
        coordinates: [-118.22258, 33.99038],
        minutes: [5, 10, 15, 20],
        meters: [5000, 10000, 15000, 20000],
        profile: 'walking'
      })
    ).toThrow("minutes and meters can't be specified at the same time");
  });
});
