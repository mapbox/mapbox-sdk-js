'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var objectClean = require('./service-helpers/object-clean');
var stringifyBooleans = require('./service-helpers/stringify-booleans');

/**
 * Directions API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/navigation/#directions).
 */
var Directions = {};

/**
 * Get directions.
 *
 * Please read [the full HTTP service documentation](https://docs.mapbox.com/api/navigation/#directions)
 * to understand all of the available options.
 *
 * @param {Object} config
 * @param {'driving-traffic'|'driving'|'walking'|'cycling'} [config.profile="driving"]
 * @param {Array<DirectionsWaypoint>} config.waypoints - An ordered array of [`DirectionsWaypoint`](#directionswaypoint) objects, between 2 and 25 (inclusive).
 * @param {boolean} [config.alternatives=false] - Whether to try to return alternative routes.
 * @param {Array<'duration'|'distance'|'speed'|'congestion'>} [config.annotations] - Specify additional metadata that should be returned.
 * @param {boolean} [config.bannerInstructions=false] - Should be used in conjunction with `steps`.
 * @param {boolean} [config.continueStraight] - Sets the allowed direction of travel when departing intermediate waypoints.
 * @param {string} [config.exclude] - Exclude certain road types from routing. See HTTP service documentation for options.
 * @param {'geojson'|'polyline'|'polyline6'} [config.geometries="polyline"] - Format of the returned geometry.
 * @param {string} [config.language="en"] - Language of returned turn-by-turn text instructions.
 *   See options listed in [the HTTP service documentation](https://docs.mapbox.com/api/navigation/#instructions-languages).
 * @param {'simplified'|'full'|'false'} [config.overview="simplified"] - Type of returned overview geometry.
 * @param {boolean} [config.roundaboutExits=false] - Emit instructions at roundabout exits.
 * @param {boolean} [config.steps=false] - Whether to return steps and turn-by-turn instructions.
 * @param {boolean} [config.voiceInstructions=false] - Whether or not to return SSML marked-up text for voice guidance along the route.
 * @param {'imperial'|'metric'} [config.voiceUnits="imperial"] - Which type of units to return in the text for voice instructions.
 * @param {'electric_no_recharge'|'electric'} [config.engine="electric_no_recharge"] - Set to electric to enable electric vehicle routing.
 * @param {number} [config.ev_initial_charge] - Optional parameter to specify initial charge of vehicle in Wh (watt-hours) at the beginning of the route.
 * @param {number} [config.ev_max_charge] - Required parameter that defines the maximum possible charge of vehicle in Wh (watt-hours).
 * @param {'ccs_combo_type1'|'ccs_combo_type1'|'tesla'} [config.ev_connector_types] - Required parameter that defines the compatible connector-types for the vehicle.
 * @param {String} [config.energy_consumption_curve] - Required parameter that specifies in pairs the energy consumption in watt-hours per kilometer at a certain speed in kph.
 * @param {String} [config.ev_charging_curve] - Required parameter that specifies the maximum battery charging rate (W) at a given charge level (Wh) in a list of pairs.
 * @param {String} [config.ev_unconditioned_charging_curve] - Optional parameter that specifies the maximum battery charging rate (W) at a given charge level (Wh) in a list of pairs when the battery is in an unconditioned state (eg: cold).
 * @param {number} [config.ev_pre_conditioning_time] - Optional parameter that defines the time in minutes it would take for the vehicle's battery to condition.
 * @param {number} [config.ev_max_ac_charging_power] - Optional parameter to specify maximum AC charging power(W) that can be delivered by the onboard vehicle charger.
 * @param {number} [config.ev_min_charge_at_destination] - Optional parameter to define the minimum battery charge required at the final route destination (Wh).
 * @param {number} [config.ev_min_charge_at_charging_station] - Optional parameter to define the minimum charge when arriving at the charging station (Wh).
 * @param {number} [config.auxiliary_consumption] - Optional parameter to define the measure of the continuous power draw of the auxiliary systems in watts (E.G heating or AC).
 * @param {number} [config.maxHeight=1.6] - Optional parameter to define the max vehicle height in meters.
 * @param {number} [config.maxWidth=1.9] - Optional parameter to define the max vehicle width in meters.
 * @param {number} [config.maxWeight=2.5] - Optional parameter to define the max vehicle weight in metric tons.
 * @param {String} [config.notifications="all"] - Returns notification metadata associated with the route leg of the route object.
 * @param {String} [config.departAt] - Optional parameter to define the departure time, formatted as a timestamp in ISO-8601 format in the local time at the route origin.
 * @param {String} [config.arriveBy] - Optional parameter to define the desired arrival time, formatted as a timestamp in ISO-8601 format in the local time at the route destination.
 * @return {MapiRequest}
 *
 * @example
 * directionsClient.getDirections({
 *   profile: 'driving-traffic',
 *   waypoints: [
 *     {
 *       coordinates: [13.4301, 52.5109],
 *       approach: 'unrestricted'
 *     },
 *     {
 *       coordinates: [13.4265, 52.508]
 *     },
 *     {
 *       coordinates: [13.4194, 52.5072],
 *       bearing: [100, 60]
 *     }
 *   ]
 * })
 *   .send()
 *   .then(response => {
 *     const directions = response.body;
 *   });
 */
Directions.getDirections = function(config) {
  v.assertShape({
    profile: v.oneOf('driving-traffic', 'driving', 'walking', 'cycling'),
    waypoints: v.required(
      v.arrayOf(
        v.shape({
          coordinates: v.required(v.coordinates),
          approach: v.oneOf('unrestricted', 'curb'),
          bearing: v.arrayOf(v.range([0, 360])),
          radius: v.oneOfType(v.number, v.equal('unlimited')),
          waypointName: v.string
        })
      )
    ),
    alternatives: v.boolean,
    annotations: v.arrayOf(
      v.oneOf(
        'duration',
        'distance',
        'speed',
        'congestion',
        'congestion_numeric',
        'max_speed',
        'closure',
        'state_of_charge'
      )
    ),
    bannerInstructions: v.boolean,
    continueStraight: v.boolean,
    exclude: v.string,
    geometries: v.string,
    language: v.string,
    overview: v.string,
    roundaboutExits: v.boolean,
    steps: v.boolean,
    voiceInstructions: v.boolean,
    voiceUnits: v.string,
    engine: v.string,
    ev_initial_charge: v.number,
    ev_max_charge: v.number,
    ev_connector_types: v.string,
    energy_consumption_curve: v.string,
    ev_charging_curve: v.string,
    ev_unconditioned_charging_curve: v.string,
    ev_pre_conditioning_time: v.number,
    ev_max_ac_charging_power: v.number,
    ev_min_charge_at_destination: v.number,
    ev_min_charge_at_charging_station: v.number,
    auxiliary_consumption: v.number,
    maxHeight: v.number,
    maxWidth: v.number,
    maxWeight: v.number,
    notifications: v.string,
    departAt: v.string,
    arriveBy: v.string
  })(config);

  config.profile = config.profile || 'driving';

  var path = {
    coordinates: [],
    approach: [],
    bearing: [],
    radius: [],
    waypointName: []
  };

  var waypointCount = config.waypoints.length;
  if (waypointCount < 2 || waypointCount > 25) {
    throw new Error(
      'waypoints must include between 2 and 25 DirectionsWaypoints'
    );
  }

  /**
   * @typedef {Object} DirectionsWaypoint
   * @property {Coordinates} coordinates
   * @property {'unrestricted'|'curb'} [approach="unrestricted"] - Used to indicate how requested routes consider from which side of the road to approach the waypoint.
   * @property {[number, number]} [bearing] - Used to filter the road segment the waypoint will be placed on by direction and dictates the angle of approach.
   *   This option should always be used in conjunction with a `radius`. The first value is an angle clockwise from true north between 0 and 360,
   *   and the second is the range of degrees the angle can deviate by.
   * @property {number|'unlimited'} [radius] - Maximum distance in meters that the coordinate is allowed to move when snapped to a nearby road segment.
   * @property {string} [waypointName] - Custom name for the waypoint used for the arrival instruction in banners and voice instructions.
   */
  config.waypoints.forEach(function(waypoint) {
    path.coordinates.push(
      waypoint.coordinates[0] + ',' + waypoint.coordinates[1]
    );

    // join props which come in pairs
    ['bearing'].forEach(function(prop) {
      if (waypoint.hasOwnProperty(prop) && waypoint[prop] != null) {
        waypoint[prop] = waypoint[prop].join(',');
      }
    });

    ['approach', 'bearing', 'radius', 'waypointName'].forEach(function(prop) {
      if (waypoint.hasOwnProperty(prop) && waypoint[prop] != null) {
        path[prop].push(waypoint[prop]);
      } else {
        path[prop].push('');
      }
    });
  });

  ['approach', 'bearing', 'radius', 'waypointName'].forEach(function(prop) {
    // avoid sending params which are all `;`
    if (
      path[prop].every(function(char) {
        return char === '';
      })
    ) {
      delete path[prop];
    } else {
      path[prop] = path[prop].join(';');
    }
  });

  var query = stringifyBooleans({
    alternatives: config.alternatives,
    annotations: config.annotations,
    banner_instructions: config.bannerInstructions,
    continue_straight: config.continueStraight,
    exclude: config.exclude,
    geometries: config.geometries,
    language: config.language,
    overview: config.overview,
    roundabout_exits: config.roundaboutExits,
    steps: config.steps,
    voice_instructions: config.voiceInstructions,
    voice_units: config.voiceUnits,
    approaches: path.approach,
    bearings: path.bearing,
    radiuses: path.radius,
    waypoint_names: path.waypointName,
    engine: config.engine,
    ev_initial_charge: config.ev_initial_charge,
    ev_max_charge: config.ev_max_charge,
    ev_connector_types: config.ev_connector_types,
    energy_consumption_curve: config.energy_consumption_curve,
    ev_charging_curve: config.ev_charging_curve,
    ev_unconditioned_charging_curve: config.ev_unconditioned_charging_curve,
    ev_pre_conditioning_time: config.ev_pre_conditioning_time,
    ev_max_ac_charging_power: config.ev_max_ac_charging_power,
    ev_min_charge_at_destination: config.ev_min_charge_at_destination,
    ev_min_charge_at_charging_station: config.ev_min_charge_at_charging_station,
    auxiliary_consumption: config.auxiliary_consumption,
    max_height: config.maxHeight,
    max_width: config.maxWidth,
    max_weight: config.maxWeight,
    notifications: config.notifications,
    depart_at: config.departAt,
    arrive_by: config.arriveBy
  });

  return this.client.createRequest({
    method: 'GET',
    path: '/directions/v5/mapbox/:profile/:coordinates',
    params: {
      profile: config.profile,
      coordinates: path.coordinates.join(';')
    },
    query: objectClean(query)
  });
};

module.exports = createServiceFactory(Directions);
