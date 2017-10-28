# addIcon

Add an icon to a sprite.

**Parameters**

-   `styleid` **string** the id for an existing style
-   `iconName` **string** icon's name
-   `icon` **Buffer** icon content as a buffer
-   `callback` **Function** called with (err)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var fs = require('fs');
var client = new MapboxClient('ACCESSTOKEN');
client.addIcon('style-id', 'icon-name', fs.readFileSync('icon.png'), function(err) {
  if (!err) console.log('added icon!');
});
```

Returns **Promise** response

# createStyle

Create a style, given the style as a JSON object.

**Parameters**

-   `style` **Object** Mapbox GL Style Spec object
-   `callback` **Function** called with (err, createdStyle)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
var style = {
  'version': 8,
  'name': 'My Awesome Style',
  'metadata': {},
  'sources': {},
  'layers': [],
  'glyphs': 'mapbox://fonts/{owner}/{fontstack}/{range}.pbf'
};
client.createStyle(style, function(err, createdStyle) {
  console.log(createdStyle);
});
```

Returns **Promise** response

# deleteIcon

Delete an icon from a sprite.

**Parameters**

-   `styleid` **string** the id for an existing style
-   `iconName` **string** icon's name
-   `callback` **Function** called with (err)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.deleteIcon('style-id', 'icon-name', function(err) {
  if (!err) console.log('deleted icon!');
});
```

Returns **Promise** response

# deleteStyle

Deletes a particular style.

**Parameters**

-   `styleid` **string** the id for an existing style
-   `callback` **Function** called with (err)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.deleteStyle('style-id', function(err) {
  if (!err) console.log('deleted!');
});
```

Returns **Promise** a promise with the response

# embedStyle

Embed a style.

**Parameters**

-   `styleid` **string** the id for an existing style
-   `options` **Object** optional params
    -   `options.title` **[boolean]** If true, shows a title box in upper right
        corner with map title and owner (optional, default `false`)
    -   `options.zoomwheel` **[boolean]** Disables zooming with mouse scroll wheel (optional, default `true`)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
var url = client.embedStyle('style-id');
```

Returns **string** URL of style embed page

# listStyles

To retrieve a listing of styles for a particular account.

**Parameters**

-   `callback` **Function** called with (err, styles)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.listStyles(function(err, styles) {
  console.log(styles);
  // [{ version: 8,
  //  name: 'Light',
  //  center: [ -77.0469979435026, 38.898634927602814 ],
  //  zoom: 12.511766533145998,
  //  bearing: 0,
  //  pitch: 0,
  //  created: '2016-02-09T14:26:15.059Z',
  //  id: 'STYLEID',
  //  modified: '2016-02-09T14:28:31.253Z',
  //  owner: '{username}' },
  //  { version: 8,
  //  name: 'Dark',
  //  created: '2015-08-28T18:05:22.517Z',
  //  id: 'STYILEID',
  //  modified: '2015-08-28T18:05:22.517Z',
  //  owner: '{username}' }]
});
```

Returns **Promise** response

# readFontGlyphRanges

Get font glyph ranges

**Parameters**

-   `font` **string** or fonts
-   `start` **number** character code of starting glyph
-   `end` **number** character code of last glyph. typically the same
    as start + 255
-   `callback` **Function** called with (err)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.readFontGlyphRanges('Arial Unicode', 0, 255, function(err, ranges) {
  if (!err) console.log(ranges);
});
```

Returns **Promise** response

# readSprite

Read sprite

**Parameters**

-   `styleid` **string** the id for an existing style
-   `options` **[Object]** optional options
    -   `options.retina` **boolean** whether the sprite JSON should be for a
        retina sprite.
-   `callback` **Function** called with (err)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.readSprite('style-id', {
  retina: true
}, function(err) {
  if (!err) console.log('deleted!');
});
```

Returns **Promise** response

# readStyle

Reads a particular style.

**Parameters**

-   `styleid` **string** the id for an existing style
-   `callback` **Function** called with (err, style)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.readStyle('style-id', function(err, style) {
  if (!err) console.log(style);
});
```

Returns **Promise** response

# updateStyle

Update a style, given the style as a JSON object.

**Parameters**

-   `style` **Object** Mapbox GL Style Spec object
-   `styleid` **string** style id
-   `callback` **Function** called with (err, createdStyle)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
var style = {
  'version': 8,
  'name': 'My Awesome Style',
  'metadata': {},
  'sources': {},
  'layers': [],
  'glyphs': 'mapbox://fonts/{owner}/{fontstack}/{range}.pbf'
};
client.updateStyle(style, 'style-id', function(err, createdStyle) {
  console.log(createdStyle);
});
```

Returns **Promise** response

# createDataset

To create a new dataset. Valid properties include title and description (not required).
This request requires an access token with the datasets:write scope.

**Parameters**

-   `options` **[object]** an object defining a dataset's properties
    -   `options.name` **[string]** the dataset's name
    -   `options.description` **[string]** the dataset's description
-   `callback` **Function** called with (err, dataset)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.createDataset({ name: 'foo', description: 'bar' }, function(err, dataset) {
  console.log(dataset);
  // {
  //   "owner": {account},
  //   "id": {dataset id},
  //   "name": "foo",
  //   "description": "description",
  //   "created": {timestamp},
  //   "modified": {timestamp}
  // }
});
```

Returns **Promise** response

# deleteDataset

To delete a particular dataset.
This request requires an access token with the datasets:write scope.

**Parameters**

-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.deleteDataset('dataset-id', function(err) {
  if (!err) console.log('deleted!');
});
```

Returns **Promise** response

# deleteFeature

Delete an existing feature from a dataset.
This request requires an access token with the datasets:write scope.

**Parameters**

-   `id` **string** the `id` of the feature to read
-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.deleteFeature('feature-id', 'dataset-id', function(err, feature) {
  if (!err) console.log('deleted!');
});
```

Returns **Promise** response

# insertFeature

Insert a feature into a dataset. This can be a new feature, or overwrite an existing one.
If overwriting an existing feature, make sure that the feature's `id` property correctly identifies
the feature you wish to overwrite.
For new features, specifying an `id` is optional. If you do not specify an `id`, one will be assigned
and returned as part of the response.
This request requires an access token with the datasets:write scope.
There are a number of limits to consider when making this request:

-   a single feature cannot be larger than 500 KB
-   the dataset must not exceed 2000 total features
-   the dataset must not exceed a total of 5 MB

**Parameters**

-   `feature` **object** the feature to insert. Must be a valid GeoJSON feature per <http://geojson.org/geojson-spec.html#feature-objects>
-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err, feature)

**Examples**

```javascript
// Insert a brand new feature without an id
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
var feature = {
  "type": "Feature",
  "properties": {
    "name": "Null Island"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [0, 0]
  }
};
client.insertFeature(feature, 'dataset-id', function(err, feature) {
  console.log(feature);
  // {
  //   "id": {feature id},
  //   "type": "Feature",
  //   "properties": {
  //     "name": "Null Island"
  //   },
  //   "geometry": {
  //     "type": "Point",
  //     "coordinates": [0, 0]
  //   }
  // }
});
```

```javascript
// Insert a brand new feature with an id, or overwrite an existing feature at that id
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
var feature = {
  "id": "feature-id",
  "type": "Feature",
  "properties": {
    "name": "Null Island"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [0, 0]
  }
};
client.insertFeature(feature, 'dataset-id', function(err, feature) {
  console.log(feature);
  // {
  //   "id": "feature-id",
  //   "type": "Feature",
  //   "properties": {
  //     "name": "Null Island"
  //   },
  //   "geometry": {
  //     "type": "Point",
  //     "coordinates": [0, 0]
  //   }
  // }
});
```

Returns **Promise** response

# listDatasets

To retrieve a listing of datasets for a particular account.
This request requires an access token with the datasets:read scope.

**Parameters**

-   `opts` **[Object]** list options (optional, default `{}`)
    -   `opts.limit` **number** limit, for paging
    -   `opts.fresh` **boolean** whether to request fresh data
-   `callback` **Function** called with (err, datasets)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.listDatasets(function(err, datasets) {
  console.log(datasets);
  // [
  //   {
  //     "owner": {account},
  //     "id": {dataset id},
  //     "name": {dataset name},
  //     "description": {dataset description},
  //     "created": {timestamp},
  //     "modified": {timestamp}
  //   },
  //   {
  //     "owner": {account},
  //     "id": {dataset id},
  //     "name": {dataset name},
  //     "description": {dataset description},
  //     "created": {timestamp},
  //     "modified": {timestamp}
  //   }
  // ]
});
```

Returns **Promise** response

# listFeatures

Retrive a list of the features in a particular dataset. The response body will be a GeoJSON FeatureCollection.
This request requires an access token with the datasets:read scope.

**Parameters**

-   `dataset` **string** the id for an existing dataset
-   `options` **[object]** an object for passing pagination arguments
    -   `options.limit` **[number]** The maximum number of objects to return. This value must be between 1 and 100. The API will attempt to return the requested number of objects, but receiving fewer objects does not necessarily signal the end of the collection. Receiving an empty page of results is the only way to determine when you are at the end of a collection.
-   `callback` **Function** called with (err, collection)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.listFeatures('dataset-id', options, function(err, collection) {
  console.log(collection);
  {
    "type": "FeatureCollection",
    "features": [
      {
        "id": {feature id},
        "type": "Feature",
        "properties": {feature properties}
        "geometry": {feature geometry}
      },
      {
        "id": {feature id},
        "type": "Feature",
        "properties": {feature properties}
        "geometry": {feature geometry}
      }
    ]
  }
});
```

Returns **Promise** response

# readDataset

To retrieve information about a particular dataset.
This request requires an access token with the datasets:read scope.

**Parameters**

-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err, dataset)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.readDataset('dataset-id', function(err, dataset) {
  console.log(dataset);
  // {
  //   "owner": {account},
  //   "id": "dataset-id",
  //   "name": {dataset name},
  //   "description": {dataset description},
  //   "created": {timestamp},
  //   "modified": {timestamp}
  // }
});
```

Returns **Promise** response

# readFeature

Read an existing feature from a dataset.
This request requires an access token with the datasets:read scope.

**Parameters**

-   `id` **string** the `id` of the feature to read
-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err, feature)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.readFeature('feature-id', 'dataset-id', function(err, feature) {
  console.log(feature);
  // {
  //   "id": "feature-id",
  //   "type": "Feature",
  //   "properties": {
  //     "name": "Null Island"
  //   },
  //   "geometry": {
  //     "type": "Point",
  //     "coordinates": [0, 0]
  //   }
  // }
});
```

Returns **Promise** response

# updateDataset

To make updates to a particular dataset's properties.
This request requires an access token with the datasets:write scope.

**Parameters**

-   `dataset` **string** the id for an existing dataset
-   `options` **[object]** an object defining updates to the dataset's properties
    -   `options.name` **[string]** the updated dataset's name
    -   `options.description` **[string]** the updated dataset's description
-   `callback` **Function** called with (err, dataset)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
var options = { name: 'foo' };
client.updateDataset('dataset-id', options, function(err, dataset) {
  console.log(dataset);
  // {
  //   "owner": {account},
  //   "id": "dataset-id",
  //   "name": "foo",
  //   "description": {dataset description},
  //   "created": {timestamp},
  //   "modified": {timestamp}
  // }
});
```

Returns **Promise** response

# createTemporaryToken

Create a temporary token

**Parameters**

-   `expires` **string** Time token expires in RFC 3339
-   `scopes` **Array** List of scopes for the new token
-   `callback` **[Function]** called with (err, token, response)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.createTemporaryToken('2016-09-15T19:27:53.000Z', ["styles:read", "fonts:read"], function(err, createdToken) {
  console.log(createdToken);
});
```

Returns **Promise** response

# createToken

Create a token

**Parameters**

-   `note` **string** Note attached to the token
-   `scopes` **Array** List of scopes for the new token
-   `callback` **[Function]** called with (err, token, response)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.createToken('My top secret project', ["styles:read", "fonts:read"], function(err, createdToken) {
  console.log(createdToken);
});
```

Returns **Promise** response

# deleteTokenAuthorization

Delete a token's authorization

**Parameters**

-   `authorization_id` **string** Authorization ID
-   `callback` **[Function]** called with (err, token, response)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.deleteTokenAuthorization('auth id', function(err) {
});
```

Returns **Promise** response

# listScopes

List scopes

**Parameters**

-   `callback` **[Function]** called with (err, scopes, response)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.listScopes(function(err, scopes) {
  console.log(scopes);
});
```

Returns **Promise** response

# listTokens

To retrieve a listing of tokens for a particular account.

**Parameters**

-   `callback` **[Function]** called with (err, tokens, response)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.listTokens(function(err, tokens) {
  console.log(tokens);
  // [{ client: 'api'
  //  note: 'Default Public Token',
  //  usage: 'pk',
  //  id: 'TOKENID',
  //  default: true,
  //  scopes: ['styles:tiles','styles:read','fonts:read','datasets:read'],
  //  created: '2016-02-09T14:26:15.059Z',
  //  modified: '2016-02-09T14:28:31.253Z',
  //  token: 'pk.TOKEN' }]
});
```

Returns **Promise** response

# retrieveToken

Retrieve a token

**Parameters**

-   `access_token` **string** access token to check
-   `callback` **[Function]** called with (err, token, response)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.retrieveToken('ACCESSTOKEN', function(err, tokenResponse) {
  console.log(tokenResponse);
});
```

Returns **Promise** response

# updateTokenAuthorization

Update a token's authorization

**Parameters**

-   `authorization_id` **string** Authorization ID
-   `scopes` **Array** List of scopes for the new token
-   `callback` **[Function]** called with (err, token, response)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.updateTokenAuthorization('auth id', ["styles:read", "fonts:read"], function(err, updatedToken) {
  console.log(updatedToken);
});
```

Returns **Promise** response

# createUpload

Create an new upload with a file previously staged on Amazon S3.

This request requires an access token with the uploads:write scope.

**Parameters**

-   `options` **Object** an object that defines the upload's properties
    -   `options.tileset` **String** id of the tileset to create or
        replace. This must consist of an account id and a unique key
        separated by a period. Reuse of a tileset value will overwrite
        existing data. To avoid overwriting existing data, you must ensure
        that you are using unique tileset ids.
    -   `options.url` **String** https url of a file staged on Amazon S3.
-   `callback` **Function** called with (err, upload)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
// Response from a call to createUploadCredentials
var credentials = {
  "accessKeyId": "{accessKeyId}",
  "bucket": "somebucket",
  "key": "hij456",
  "secretAccessKey": "{secretAccessKey}",
  "sessionToken": "{sessionToken}",
  "url": "{s3 url}"
};
mapboxClient.createUpload({
   tileset: [accountid, 'mytileset'].join('.'),
   url: credentials.url
}, function(err, upload) {
  console.log(upload);
  // {
  //   "complete": false,
  //   "tileset": "example.markers",
  //   "error": null,
  //   "id": "hij456",
  //   "modified": "2014-11-21T19:41:10.000Z",
  //   "created": "2014-11-21T19:41:10.000Z",
  //   "owner": "example",
  //   "progress": 0
  // }
});
```

Returns **Promise** response

# createUploadCredentials

Retrieve credentials that allow a new file to be staged on Amazon S3
while an upload is processed. All uploads must be staged using these
credentials before being uploaded to Mapbox.

This request requires an access token with the uploads:write scope.

**Parameters**

-   `callback` **Function** called with (err, credentials)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.createUploadCredentials(function(err, credentials) {
  console.log(credentials);
  // {
  //   "accessKeyId": "{accessKeyId}",
  //   "bucket": "somebucket",
  //   "key": "hij456",
  //   "secretAccessKey": "{secretAccessKey}",
  //   "sessionToken": "{sessionToken}",
  //   "url": "{s3 url}"
  // }

  // Use aws-sdk to stage the file on Amazon S3
  var AWS = require('aws-sdk');
  var s3 = new AWS.S3({
       accessKeyId: credentials.accessKeyId,
       secretAccessKey: credentials.secretAccessKey,
       sessionToken: credentials.sessionToken,
       region: 'us-east-1'
  });
  s3.putObject({
    Bucket: credentials.bucket,
    Key: credentials.key,
    Body: fs.createReadStream('/path/to/file.mbtiles')
  }, function(err, resp) {
  });
});
```

Returns **Promise** response

# deleteUpload

Delete a completed upload. In-progress uploads cannot be deleted.

This request requires an access token with the uploads:delete scope.

**Parameters**

-   `upload` **string** upload identifier
-   `callback` **Function** called with (err)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.deleteUpload('hij456', function(err) {
});
```

Returns **Promise** response

# listUploads

Retrieve a listing of uploads for a particular account.

This request requires an access token with the uploads:list scope.

**Parameters**

-   `callback` **Function** called with (err, uploads)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.listUploads(function(err, uploads) {
  console.log(uploads);
  // [
  //   {
  //     "complete": true,
  //     "tileset": "example.mbtiles",
  //     "error": null,
  //     "id": "abc123",
  //     "modified": "2014-11-21T19:41:10.000Z",
  //     "created": "2014-11-21T19:41:10.000Z",
  //     "owner": "example",
  //     "progress": 1
  //   },
  //   {
  //     "complete": false,
  //     "tileset": "example.foo",
  //     "error": null,
  //     "id": "xyz789",
  //     "modified": "2014-11-21T19:41:10.000Z",
  //     "created": "2014-11-21T19:41:10.000Z",
  //     "owner": "example",
  //     "progress": 0
  //   }
  // ]
});
```

Returns **Promise** response

# readUpload

Retrieve state of an upload.

This request requires an access token with the uploads:read scope.

**Parameters**

-   `upload` **String** id of the upload to read
-   `callback` **Function** called with (err, upload)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.readUpload('hij456', function(err, upload) {
  console.log(upload);
  // {
  //   "complete": true,
  //   "tileset": "example.markers",
  //   "error": null,
  //   "id": "hij456",
  //   "modified": "2014-11-21T19:41:10.000Z",
  //   "created": "2014-11-21T19:41:10.000Z",
  //   "owner": "example",
  //   "progress": 1
  // }
});
```

Returns **Promise** response

# encode

Encodes the given [latitude, longitude] coordinates array.

**Parameters**

-   `coordinates` **Array&lt;Array&lt;Number&gt;&gt;** 
-   `precision` **Number** 

Returns **String** 

# fromGeoJSON

Encodes a GeoJSON LineString feature/geometry.

**Parameters**

-   `geojson` **Object** 
-   `precision` **Number** 

Returns **String** 

# MapboxClient

The JavaScript API to Mapbox services

**Parameters**

-   `accessToken` **string** a private or public access token
-   `options` **Object** additional options provided for configuration
    -   `options.endpoint` **[string]** location
        of the Mapbox API pointed-to. This can be customized to point to a
        Mapbox Atlas Server instance, or a different service, a mock,
        or a staging endpoint. Usually you don't need to customize this. (optional, default `https://api.mapbox.com`)
    -   `options.account` **[string]** account id to use for api
        requests. If not is specified, the account defaults to the owner
        of the provided accessToken.

**Examples**

```javascript
var client = new MapboxClient('ACCESSTOKEN');
```

## geocodeForward

Search for a location with a string, using the
[Mapbox Geocoding API](https://www.mapbox.com/api-documentation/#geocoding).

The `query` parmeter can be an array of strings only if batch geocoding
is used by specifying `mapbox.places-permanent` as the `dataset` option.

**Parameters**

-   `query` **string or Array&lt;string&gt;** desired location
-   `options` **[Object]** additional options meant to tune
    the request (optional, default `{}`)
    -   `options.proximity` **Object** a proximity argument: this is
        a geographical point given as an object with latitude and longitude
        properties. Search results closer to this point will be given
        higher priority.
    -   `options.bbox` **Array** a bounding box argument: this is
        a bounding box given as an array in the format [minX, minY, maxX, maxY].
        Search results will be limited to the bounding box.
    -   `options.language` **string** Specify the language to use for response text and, for forward geocoding, query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script. More than one value can also be specified, separated by commas.
    -   `options.limit` **[number]** is the maximum number of results to return, between 1 and 10 inclusive.
        Some very specific queries may return fewer results than the limit. (optional, default `5`)
    -   `options.country` **string** a comma separated list of country codes to
        limit results to specified country or countries.
    -   `options.autocomplete` **[boolean]** whether to include results that include
        the query only as a prefix. This is useful for UIs where users type
        values, but if you have complete addresses as input, you'll want to turn it off (optional, default `true`)
    -   `options.dataset` **[string]** the desired data to be
        geocoded against. The default, mapbox.places, does not permit unlimited
        caching. `mapbox.places-permanent` is available on request and does
        permit permanent caching. (optional, default `mapbox.places`)
    -   `options.types` **string** a comma seperated list of types that filter
        results to match those specified. See <https://www.mapbox.com/developers/api/geocoding/#filter-type>
        for available types.
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
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
// using the bbox option to limit results to a portion of Washington, D.C.
mapboxClient.geocodeForward('Starbucks', {
  bbox: [-77.083056,38.908611,-76.997778,38.959167]
}, function(err, res) {
  // res is a GeoJSON document with geocoding matches
});
```

Returns **Promise** response

## getDirections

Find directions from A to B, or between any number of locations.
Consult the [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions)
for more documentation.

**Parameters**

-   `waypoints` **Array&lt;Object&gt;** an array of objects with `latitude`
    and `longitude` properties that represent waypoints in order. Up to
    25 waypoints can be specified.
-   `options` **[Object]** additional options meant to tune
    the request (optional, default `{}`)
    -   `options.profile` **[string]** the directions
        profile, which determines how to prioritize different routes.
        Options are `'driving-traffic'` for automotive routing which factors
        in current and historic traffic conditions to avoid slowdowns,
        `'driving'`, which assumes transportation via an
        automobile and will use highways, `'walking'`, which avoids
        streets without sidewalks, and `'cycling'`, which prefers streets
        with bicycle lanes and lower speed limits for transportation via
        bicycle. (optional, default `driving`)
    -   `options.account` **[string]** Account for the profile. (optional, default `mapbox`)
    -   `options.alternatives` **[string]** whether to generate
        alternative routes along with the preferred route. (optional, default `true`)
    -   `options.geometries` **[string]** format for the returned
        route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline`
        yields more compact responses which can be decoded on the client side.
        [GeoJSON](http://geojson.org/), the default, is compatible with libraries
        like [Mapbox GL](https://www.mapbox.com/mapbox-gl/),
        Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false`
        omits the geometry entirely and only returns instructions. (optional, default `geojson`)
    -   `options.radiuses` **[Array&lt;number or string&gt;]** an array of integers in meters
        indicating the maximum distance each coordinate is allowed to move when
        snapped to a nearby road segment. There must be as many radiuses as there
        are coordinates in the request. Values can be any number greater than `0` or
        they can be the string `unlimited`. If no routable road is found within the
        radius, a `NoSegment` error is returned.
    -   `options.steps` **[boolean]** whether to return steps and
        turn-by-turn instructions. Can be `true` or `false`. (optional, default `false`)
    -   `options.continue_straight` **[boolean]** sets allowed direction of travel
        when departing intermediate waypoints. If `true` the route will continue in
        the same direction of travel. If `false` the route may continue in the
        opposite direction of travel. Defaults to `true` for the `driving` profile
        and `false` for the `walking` and `cycling` profiles.
    -   `options.bearings` **[Array&lt;Array&gt;]** used to filter the road
        segment the waypoint will be placed on by direction and dictates the angle
        of approach. This option should always be used in conjunction with the
        `radiuses` option. The parameter takes two values per waypoint: the first is
        an angle clockwise from true north between `0` and `360`. The second is the
        range of degrees the angle can deviate by. We recommend a value of `45` or
        `90` for the range, as bearing measurements tend to be inaccurate. This is
        useful for making sure we reroute vehicles on new routes that continue
        traveling in their current direction. A request that does this would provide
        bearing and radius values for the first waypoint and leave the remaining
        values empty.If provided, the list of bearings must be the same length as
        the list of waypoints, but you can skip a coordinate and show its position
        by providing an empty array.
    -   `options.overview` **[string]** type of returned overview
        geometry. Can be `full` (the most detailed geometry available), `simplified`
        (a simplified version of the full geometry), or `false`. (optional, default `simplified`)
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.getDirections(
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
  profile: 'walking',
  alternatives: false,
  geometry: 'polyline'
}, function(err, results) {
  console.log(results);
});
```

Returns **Promise** response

## getMatrix

Compute a table of travel-time estimates between a set of waypoints.
Consult the [Mapbox Matrix API](https://www.mapbox.com/api-documentation/#matrix)
for more documentation and limits.

**Parameters**

-   `waypoints` **Array&lt;Object&gt;** an array of coordinate objects
    in the form `{longitude: 0, latitude: 0}`.
-   `options` **[Object]** additional options meant to tune
    the request (optional, default `{}`)
    -   `options.profile` **[string]** the directions
        profile, which determines how to prioritize different routes.
        Options are `'driving'`, which assumes transportation via an
        automobile and will use highways, `'walking'`, which avoids
        streets without sidewalks, and `'cycling'`, which prefers streets
        with bicycle lanes and lower speed limits for transportation via
        bicycle. The `'driving-traffic'` profile is not supported. (optional, default `driving`)
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
// Without options
mapboxClient.getMatrix([{
  longitude: -122.42,
  latitude: 37.78
},
{
  longitude: -122.45,
  latitude: 37.91
},
{
  longitude: -122.48,
  latitude: 37.73
}], {
}, function(err, results) {
  console.log(results);
});

// With options
mapboxClient.getMatrix([{
  longitude: -122.42,
  latitude: 37.78
},
{
  longitude: -122.45,
  latitude: 37.91
},
{
  longitude: -122.48,
  latitude: 37.73
}], { profile: 'walking' }, {
}, function(err, results) {
  console.log(results);
});

// Results is an object like:
{ durations:
  [ [ 0, 1196, 3977, 3415, 5196 ],
    [ 1207, 0, 3775, 3213, 4993 ],
    [ 3976, 3774, 0, 2650, 2579 ],
    [ 3415, 3212, 2650, 0, 3869 ],
    [ 5208, 5006, 2579, 3882, 0 ] ] }

// If the coordinates include an un-routable place, then
// the table may contain 'null' values to indicate this, like
{ durations:
  [ [ 0, 11642, 57965, null, 72782 ],
    [ 11642, 0, 56394, null, 69918 ],
    [ 57965, 56394, 0, null, 19284 ],
    [ null, null, null, 0, null ],
    [ 72782, 69918, 19284, null, 0 ] ] }
```

Returns **Promise** response

## getStaticClassicURL

Determine a URL for a static classic map image, using the [Mapbox Static (Classic) Map API](https://www.mapbox.com/api-documentation/pages/static_classic.html).

**Parameters**

-   `mapid` **string** a Mapbox map id in username.id form
-   `options.path.style` **Array&lt;Object&gt;** optional style definitions for a path
-   `height` **number** height of the image
-   `position` **Object or string** either an object with longitude and latitude members, or the string 'auto'
    -   `position.longitude` **number** east, west bearing
    -   `position.latitude` **number** north, south bearing
    -   `position.zoom` **number** zoom level
-   `width` **number** width of the image
-   `options.format` **[string]** image format. can be jpg70, jpg80, jpg90, png32, png64, png128, png256 (optional, default `png`)
-   `options.retina` **[boolean]** whether to double image pixel density (optional, default `false`)
-   `options.markers` **[Array&lt;Object&gt;]** an array of simple marker objects as an overlay (optional, default `[]`)
-   `options.geojson` **[Object]** geojson data for the overlay (optional, default `{}`)
-   `options.path` **[Object]** a path and (optional, default `{}`)
    -   `options.path.geojson` **Array&lt;Object&gt;** data for the path as an array of longitude, latitude objects
-   `options` **Object** all map options

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
```

Returns **string** static classic map url

## getStaticURL

Determine a URL for a static map image, using the [Mapbox Static Map API](https://www.mapbox.com/api-documentation/#static).

**Parameters**

-   `username` **string** Mapbox username
-   `options.before_layer` **string** value for controlling where the overlay is inserted in the style
-   `width` **number** width of the image
-   `height` **number** height of the image
-   `position` **Object or string** either an object with longitude and latitude members, or the string 'auto'
    -   `position.longitude` **number** east, west bearing
    -   `position.latitude` **number** north, south bearing
    -   `position.zoom` **number** map zoom level
    -   `position.bearing` **number** map bearing in degrees between 0 and 360
    -   `position.pitch` **number** map pitch in degrees between 0 (straight down, no pitch) and 60 (maximum pitch)
-   `styleid` **string** Mapbox Style ID
-   `options.retina` **[boolean]** whether to double image pixel density (optional, default `false`)
-   `options.markers` **[Array&lt;Object&gt;]** an array of simple marker objects as an overlay (optional, default `[]`)
-   `options.geojson` **[Object]** geojson data for the overlay (optional, default `{}`)
-   `options.path` **[Object]** a path and (optional, default `{}`)
    -   `options.path.geojson` **Array&lt;Object&gt;** data for the path as an array of longitude, latitude objects
    -   `options.path.style` **Array&lt;Object&gt;** optional style definitions for a path
-   `options.attribution` **boolean** controlling whether there is attribution on the image; defaults to true
-   `options.logo` **boolean** controlling whether there is a Mapbox logo on the image; defaults to true
-   `options` **Object** all map options

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
var url = mapboxClient.getStaticURL('mapbox', 'streets-v10', 600, 400, {
  longitude: 151.22,
  latitude: -33.87,
  zoom: 11
}, {
  markers: [{ longitude: 151.22, latitude: -33.87 }],
  before_layer: 'housenum-label'
});
// url = https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-l-circle(151.22,-33.87)/151.22,-33.87,11/600x400?access_token=ACCESS_TOKEN&before_layer=housenum-label
```

Returns **string** static map url

## matching

Snap recorded location traces to roads and paths from OpenStreetMap.
Consult the [Map Matching API](https://www.mapbox.com/api-documentation/#map-matching)
for more documentation.

**Parameters**

-   `coordinates` **Array&lt;Array&lt;number&gt;&gt;** an array of coordinate pairs
    in [longitude, latitude] order. Up to 100 coordinates can be specified.
-   `options` **[Object]** additional options meant to tune
    the request (optional, default `{}`)
    -   `options.profile` **[string]** the directions
        profile, which determines how to prioritize different routes.
        Options are `'driving'`, which assumes transportation via an
        automobile and will use highways, `'walking'`, which avoids
        streets without sidewalks, and `'cycling'`, which prefers streets
        with bicycle lanes and lower speed limits for transportation via
        bicycle. (optional, default `driving`)
    -   `options.geometries` **[string]** format of the returned geometry.
        Allowed values are: `'geojson'` (as LineString), `'polyline'` with
        precision 5, `'polyline6'`. `'polyline'` yields more compact responses which
        can be decoded on the client side. [GeoJSON](http://geojson.org/), the
        default, is compatible with libraries like
        [Mapbox GL](https://www.mapbox.com/mapbox-gl/), Leaflet and
        [Mapbox.js](https://www.mapbox.com/mapbox.js/). (optional, default `geojson`)
    -   `options.radiuses` **[Array&lt;number&gt;]** an array of integers in meters
        indicating the assumed precision of the used tracking device. There must be
        as many radiuses as there are coordinates in the request. Values can be a
        number between 0 and 30. Use higher numbers (20-30) for noisy traces and
        lower numbers (1-10) for clean traces. The default value is 5.
    -   `options.steps` **[boolean]** Whether to return steps and
        turn-by-turn instructions. Can be `true` or `false`. (optional, default `false`)
    -   `options.overview` **[string or boolean]** type of returned
        overview geometry. Can be `'full'` (the most detailed geometry available),
        `'simplified'` (a simplified version of the full geometry), or `false`. (optional, default `simplified`)
    -   `options.timestamps` **[Array&lt;number&gt;]** an array of timestamps
        corresponding to each coordinate provided in the request; must be numbers in
        [Unix time](https://en.wikipedia.org/wiki/Unix_time)
        (seconds since the Unix epoch). There must be as many timestamps as there
        are coordinates in the request.
    -   `options.annotations` **[Array&lt;string&gt;]** an array of fields that return
        additional metadata for each coordinate along the match geometry. Can be any
        of `'duration'`, `'distance'`, or `'nodes'`.
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.matching([
  [-95.4431142, 33.6875431],
  [-95.0431142, 33.6875431],
  [-95.0431142, 33.0875431],
  [-95.0431142, 33.0175431],
  [-95.4831142, 33.6875431]
], {
 overview: 'full'
}, function(err, res) {
  // res is a match response object
});
```

Returns **Promise** response

## surface

Given a list of locations, retrieve vector tiles, find the nearest
spatial features, extract their data values, and then absolute values and
optionally interpolated values in-between, if the interpolate option is specified.

Consult the [Surface API](https://www.mapbox.com/developers/api/surface/)
for more documentation.

**Parameters**

-   `mapid` **string** a Mapbox mapid containing vector tiles against
    which we'll query
-   `layer` **string** layer within the given `mapid` for which to pull
    data
-   `fields` **Array&lt;string&gt;** layer within the given `mapid` for which to pull
    data
-   `path` **Array&lt;Object&gt; or string** either an encoded polyline,
    provided as a string, or an array of objects with longitude and latitude
    properties, similar to waypoints.
-   `options` **[Object]** additional options meant to tune
    the request (optional, default `{}`)
    -   `options.geojson` **[string]** whether to return data as a
        GeoJSON point (optional, default `false`)
    -   `options.zoom` **[string]** zoom level at which features
        are queried (optional, default `maximum`)
    -   `options.interpolate` **[boolean]** Whether to interpolate
        between matches in the feature collection. (optional, default `true`)
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
```

Returns **Promise** response

# geocodeReverse

Given a location, determine what geographical features are located
there. This uses the [Mapbox Geocoding API](https://www.mapbox.com/api-documentation/#geocoding).

**Parameters**

-   `location` **Object** the geographical point to search
    -   `location.latitude` **number** decimal degrees latitude, in range -90 to 90
    -   `location.longitude` **number** decimal degrees longitude, in range -180 to 180
-   `options` **[Object]** additional options meant to tune
    the request. (optional, default `{}`)
    -   `options.language` **string** Specify the language to use for response text and, for forward geocoding, query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script. More than one value can also be specified, separated by commas.
    -   `options.types` **string** a comma seperated list of types that filter
        results to match those specified. See
        <https://www.mapbox.com/api-documentation/#retrieve-places-near-a-location>
        for available types.
    -   `options.limit` **[number]** is the maximum number of results to return, between 1 and 5
        inclusive. Requires a single options.types to be specified (see example). (optional, default `1`)
    -   `options.dataset` **[string]** the desired data to be
        geocoded against. The default, mapbox.places, does not permit unlimited
        caching. `mapbox.places-permanent` is available on request and does
        permit permanent caching. (optional, default `mapbox.places`)
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.geocodeReverse(
  { latitude: 33.6875431, longitude: -95.4431142 },
  function(err, res) {
  // res is a GeoJSON document with geocoding matches
});
```

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.geocodeReverse(
  { latitude: 33.6875431, longitude: -95.4431142, options: { types: address, limit: 3 } },
  function(err, res) {
  // res is a GeoJSON document with up to 3 geocoding matches
});
```

Returns **Promise** response

# getTilestats

To retrieve statistics about a specific tileset.

**Parameters**

-   `tileset` **String** the id for the tileset
-   `callback` **Function** called with (err, tilestats)

**Examples**

```javascript
var client = new MapboxClient('ACCESSTOKEN');
client.getTilestats('tileset-id', function(err, info) {
  console.log(info);
  // {
  //   "layerCount": {layer count},
  //   "layers": [
  //     {
  //       "layer": {layer name},
  //       "geometry": {dominant geometry},
  //       "count": {feature count},
  //       "attributeCount": {attribute count}
  //       "attributes": [
  //         {
  //           "attribute": {attribute name},
  //           "type": {attribute type},
  //           "count": {unique value count},
  //           "min": {minimum value if type is number},
  //           "max": {maximum value if type is number},
  //           "values": [{...unique values}]
  //         }
  //       ]
  //     }
  //   ]
  // }
});
```

Returns **Promise** response

# putTilestats

To create or update statistics about a specific tileset.

**Parameters**

-   `tileset` **String** the id for the tileset
-   `statistics` **object** the statistics to upload
-   `callback` **Function** called with (err, tilestats)

**Examples**

```javascript
var client = new MapboxClient('ACCESSTOKEN');
client.getTilestats('tileset-id', function(err, stats) {
  console.log(stats);
  // {
  //   "account": {account}
  //   ... see stats example above (for Tilestats#getTilestats)
  // }
});
```

Returns **Promise** response

# listTilesets

Retrieve all tilesets

**Parameters**

-   `options` **[Object]** optional options
    -   `options.limit` **Number** Maximum Number of tilesets to return
-   `callback` **[Function]** called with (err, tilesets, response)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.listTilesets(function(err, tilesets) {
  console.log(tilesets);
});
```

Returns **Promise** response

# tilequery

Retrieve data about specific vector features at a specified location within a vector tileset

**Parameters**

-   `mapid` **String** Map ID of the tileset to query (eg. mapbox.mapbox-streets-v7)
-   `position` **Array** An array in the form [longitude, latitude] of the position to query
-   `options` **[Object]** optional options
    -   `options.radius` **Number** Approximate distance in meters to query for features
    -   `options.limit` **Number** Number of features between 1-50 to return
-   `callback` **[Function]** called with (err, results, response)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.tilequery('mapbox.mapbox-streets-v7', [-77, 38], {}, function(err, response) {
  console.log(response);
});
```

Returns **Promise** response
