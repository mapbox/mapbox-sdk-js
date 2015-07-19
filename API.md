## `MapboxClient`

The JavaScript API to Mapbox services

### Parameters

* `accessToken` **`string`** a private or public access token
* `options` **`Object`** additional options provided for configuration
  * `options.endpoint` **`[string]`** location of the Mapbox API pointed-to. This can be customized to point to a Mapbox Atlas Server instance, or a different service, a mock, or a staging endpoint. Usually you don't need to customize this. (optional, default `https://api.mapbox.com`)


### Examples

```js
var client = new MapboxClient('ACCESSTOKEN');
```


| type | description |
| ---- | ----------- |
| `Error` | if accessToken is not provided |
## `geocodeForward`

Search for a location with a string, using the
[Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/).

### Parameters

* `query` **`string`** desired location
* `options` **`[Object]`** additional options meant to tune the request (optional, default `{}`)
  * `options.proximity` **`Object`** a proximity argument: this is a geographical point given as an object with latitude and longitude properties. Search results closer to this point will be given higher priority.
  * `options.dataset` **`[string]`** the desired data to be geocoded against. The default, mapbox.places, does not permit unlimited caching. `mapbox.places-permanent` is available on request and does permit permanent caching. (optional, default `mapbox.places`)
* `callback` **`Function`** called with (err, results)


### Examples

```js
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.geocodeForward('Paris, France', function(err, res) {
  // res is a GeoJSON document with geocoding matches
});
// using the proximity option to weight results closer to texas
mapboxClient.geocodeForward('Paris, France', {
  proximity: { latitude: 33.6875431, longitude: -95.4431142 }
}, function(err, res) {
  // res is a GeoJSON document with geocoding matches
});
```

Returns  nothing, calls callback

## `geocodeReverse`

Given a location, determine what geographical features are located
there. This uses the [Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/).

### Parameters

* `location` **`Object`** the geographical point to search
  * `location.latitude` **`number`** decimal degrees latitude, in range -90 to 90
  * `location.longitude` **`number`** decimal degrees longitude, in range -180 to 180
* `options` **`[Object]`** additional options meant to tune the request (optional, default `{}`)
  * `options.dataset` **`[string]`** the desired data to be geocoded against. The default, mapbox.places, does not permit unlimited caching. `mapbox.places-permanent` is available on request and does permit permanent caching. (optional, default `mapbox.places`)
* `callback` **`Function`** called with (err, results)


### Examples

```js
var mapboxClient = new MapboxGeocoder('ACCESSTOKEN');
mapboxClient.geocodeReverse(
  { latitude: 33.6875431, longitude: -95.4431142 },
  function(err, res) {
  // res is a GeoJSON document with geocoding matches
});
```

Returns  nothing, calls callback

## `getDirections`

Find directions from A to B, or between any number of locations.
Consult the [Mapbox Directions API](https://www.mapbox.com/developers/api/directions/)
for more documentation.

### Parameters

* `waypoints` **`Array<Object>`** an array of objects with `latitude` and `longitude` properties that represent waypoints in order. Up to 25 waypoints can be specified.
* `options` **`[Object]`** additional options meant to tune the request (optional, default `{}`)
  * `options.profile` **`[string]`** the directions profile, which determines how to prioritize different routes. Options are `'mapbox.driving'`, which assumes transportation via an automobile and will use highways, `'mapbox.walking'`, which avoids streets without sidewalks, and `'mapbox.cycling'`, which prefers streets with bicycle lanes and lower speed limits for transportation via bicycle. (optional, default `mapbox.driving`)
  * `options.alternatives` **`[string]`** whether to generate alternative routes along with the preferred route. (optional, default `true`)
  * `options.instructions` **`[string]`** format for turn-by-turn instructions along the route. (optional, default `text`)
  * `options.geometry` **`[string]`** format for the returned route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline` yields more compact responses which can be decoded on the client side. [GeoJSON](http://geojson.org/), the default, is compatible with libraries like [Mapbox GL](https://www.mapbox.com/mapbox-gl/), Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false` omits the geometry entirely and only returns instructions. (optional, default `geojson`)
* `callback` **`Function`** called with (err, results)


### Examples

```js
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.directions(
  [
    { latitude: 33.6, longitude: -95.4431 },
    { latitude: 33.2, longitude: -95.4431 } ],
  function(err, res) {
  // res is a document with directions
});

// With options
mapboxClient.getDirections([
  { latitude: 33.6875431, longitude: -95.4431142 },
  { latitude: 33.6875431, longitude: -95.4831142 }
], {
  profile: 'mapbox.walking',
  instructions: 'html',
  alternatives: false,
  geometry: 'polyline'
}, function(err, results) {
  console.log(results.origin);
});
```

Returns  nothing, calls callback

## `matching`

Snap recorded location traces to roads and paths from OpenStreetMap.
Consult the [Map Matching API](https://www.mapbox.com/developers/api/map-matching/)
for more documentation.

### Parameters

* `trace` **`Object`** a single [GeoJSON](http://geojson.org/) Feature with a LineString geometry, containing up to 100 positions.
* `options` **`[Object]`** additional options meant to tune the request (optional, default `{}`)
  * `options.profile` **`[string]`** the directions profile, which determines how to prioritize different routes. Options are `'mapbox.driving'`, which assumes transportation via an automobile and will use highways, `'mapbox.walking'`, which avoids streets without sidewalks, and `'mapbox.cycling'`, which prefers streets with bicycle lanes and lower speed limits for transportation via bicycle. (optional, default `mapbox.driving`)
  * `options.geometry` **`[string]`** format for the returned route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline` yields more compact responses which can be decoded on the client side. [GeoJSON](http://geojson.org/), the default, is compatible with libraries like [Mapbox GL](https://www.mapbox.com/mapbox-gl/), Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false` omits the geometry entirely and only returns matched points. (optional, default `geojson`)
  * `options.gps_precision` **`[number]`** An integer in meters indicating the assumed precision of the used tracking device. Use higher numbers (5-10) for noisy traces and lower numbers (1-3) for clean traces. The default value is 4. (optional, default `4`)
* `callback` **`Function`** called with (err, results)


### Examples

```js
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.matching({
  "type": "Feature",
  "properties": {
    "coordTimes": [
      "2015-04-21T06:00:00Z",
      "2015-04-21T06:00:05Z",
      "2015-04-21T06:00:10Z",
      "2015-04-21T06:00:15Z",
      "2015-04-21T06:00:20Z"
    ]
    },
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [ 13.418946862220764, 52.50055852688439 ],
      [ 13.419011235237122, 52.50113000479732 ],
      [ 13.419756889343262, 52.50171780290061 ],
      [ 13.419885635375975, 52.50237416816131 ],
      [ 13.420631289482117, 52.50294888790448 ]
    ]
  }
},
  function(err, res) {
  // res is a document with directions
});
```

Returns  nothing, calls callback

## `surface`

Given a list of locations, retrieve vector tiles, find the nearest
spatial features, extract their data values, and then absolute values and
optionally interpolated values in-between, if the interpolate option is specified.

Consult the [Surface API](https://www.mapbox.com/developers/api/surface/)
for more documentation.

### Parameters

* `mapid` **`string`** a Mapbox mapid containing vector tiles against which we'll query
* `layer` **`string`** layer within the given `mapid` for which to pull data
* `fields` **`Array<string>`** layer within the given `mapid` for which to pull data
* `path` **`Array<Object> or string`** either an encoded polyline, provided as a string, or an array of objects with longitude and latitude properties, similar to waypoints.
* `options` **`[Object]`** additional options meant to tune the request (optional, default `{}`)
  * `options.geojson` **`[string]`** whether to return data as a GeoJSON point (optional, default `false`)
  * `options.zoom` **`[string]`** zoom level at which features are queried (optional, default `maximum`)
  * `options.interpolate` **`[boolean]`** Whether to interpolate between matches in the feature collection. (optional, default `true`)
* `callback` **`Function`** called with (err, results)


### Examples

```js
var mapboxClient = new MapboxClient('ACCESSTOKEN');
```

Returns  nothing, calls callback

