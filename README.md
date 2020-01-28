# @mapbox/mapbox-sdk

A JS SDK for working with [Mapbox APIs](https://docs.mapbox.com/api/).

Works in Node, the browser, and React Native.

**As of 6/11/18, the codebase has been rewritten and a new npm package released.**
The `mapbox` package is deprecated in favor of the new `@mapbox/mapbox-sdk` package.
Please read the documentation and open issues with questions or problems.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Creating clients](#creating-clients)
  - [Creating and sending requests](#creating-and-sending-requests)
- [Overview of requests, responses, and errors](#overview-of-requests-responses-and-errors)
  - [MapiRequest](#mapirequest)
  - [MapiResponse](#mapiresponse)
  - [MapiError](#mapierror)
- [Services](#services)
- [Pre-bundled files on unpkg.com](#pre-bundled-files-on-unpkgcom)
- [Development](#development)

## Installation

```
npm install @mapbox/mapbox-sdk
```

**If you are supporting older browsers, you will need a Promise polyfill.**
[es6-promise](https://github.com/stefanpenner/es6-promise) is a good one, if you're uncertain.

The documentation below assumes you're using a JS module system.
If you aren't, read ["Pre-bundled files on unpkg.com"](#pre-bundled-files-on-unpkgcom).

## Usage

There are 3 basic steps to getting an API response:

1. Create a client.
2. Create a request.
3. Send the request.

### Creating clients

To **create a service client**, import the service's factory function from `'@mapbox/mapbox-sdk/services/{service}'` and provide it with your access token.

The service client exposes methods that create requests.

```js
const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const stylesService = mbxStyles({ accessToken: MY_ACCESS_TOKEN });
// stylesService exposes listStyles(), createStyle(), getStyle(), etc.
```

You can also **share one configuration between multiple services**.
To do that, initialize a base client and then pass *that* into service factory functions.

```js
const mbxClient = require('@mapbox/mapbox-sdk');
const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const mbxTilesets = require('@mapbox/mapbox-sdk/services/tilesets');

const baseClient = mbxClient({ accessToken: MY_ACCESS_TOKEN });
const stylesService = mbxStyles(baseClient);
const tilesetsService = mbxTilesets(baseClient);
```

### Creating and sending requests

To **create a request**, invoke a method on a service client.

Once you've created a request, **send the request** with its `send` method.
It will return a Promise that resolves with a `MapiResponse`.

```js
const mbxClient = require('@mapbox/mapbox-sdk');
const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const mbxTilesets = require('@mapbox/mapbox-sdk/services/tilesets');

const baseClient = mbxClient({ accessToken: MY_ACCESS_TOKEN });
const stylesService = mbxStyles(baseClient);
const tilesetsService = mbxTilesets(baseClient);

// Create a style.
stylesService.createStyle({..})
  .send()
  .then(response => {..}, error => {..});

// List tilesets.
tilesetsService.listTilesets()
  .send()
  .then(response => {..}, error => {..})
```

## Overview of requests, responses, and errors

**For more details, please read [the full classes documentation](./docs/classes.md).**

### `MapiRequest`

Service methods return `MapiRequest` objects.

Typically, you'll create a `MapiRequest` then `send` it.
`send` returns a `Promise` that resolves with a [`MapiResponse`] or rejects with a [`MapiError`].

`MapiRequest`s also expose other properties and methods that you might use from time to time.
For example:

- `MapiRequest#abort` aborts the request.
- `MapiRequest#eachPage` executes a callback for each page of a paginated API response.
- `MapiRequest.emitter` exposes an event emitter that fires events like `downloadProgress` and `uploadProgress`.

For more details, please read [the full `MapiRequest` documentation](./docs/classes.md#mapirequest).

```js
// Create a request and send it.
stylesService.createStyle({..})
  .send()
  .then(response => {..}, error => {..});

// Abort a request.
const req = tilesetsService.listTilesets();
req.send().then(response => {..}, error => {
  // Because the request is aborted, an error will be thrown that we can
  // catch and handle.
});
req.abort();

// Paginate through a response.
tilesetsService.listTilesets().eachPage((error, response, next) => {
  // Do something with the page, then call next() to send the request
  // for the next page.

  // You can check whether there will be a next page using
  // MapiResponse#hasNextPage, if you want to do something
  // different on the last page.
  if (!response.hasNextPage()) {..}
});

// Listen for uploadProgress events.
const req = stylesService.createStyleIcon({..});
req.on('uploadProgress', event => {
  // Do something with the progress event information.
});
req.send().then(response => {..}, error => {..});
```

### `MapiResponse`

When you `send` a [`MapiRequest`], the returned `Promise` resolves with a `MapiResponse`.

Typically, you'll use `MapiResponse.body` to access the parsed API response.

`MapiResponse`s also expose other properties and methods.
For example:

- `MapiResponse#hasNextPage` indicates if there is another page of results.
- If there is another page, `MapiResponse#nextPage` creates a [`MapiRequest`] that you can `send` to get that next page.
- `MapiResponse.headers` exposes the parsed HTTP headers from the API response.

For more details, please read [the full `MapiResponse` documentation](./docs/classes.md#mapiresponse).

```js
// Read a response body.
stylesService.getStyle({..})
  .send()
  .then(resp => {
    const style = resp.body;
    // Do something with the style.
  }, err => {..});

// Get the next page of results.
tilesetsService.listTilesets()
  .send()
  .then(resp => {
    if (resp.hasNextPage()) {
      const nextPageReq = resp.nextPage();
      nextPageReq.send().then(..);
    }
  }, err => {..});

// Check the headers.
tilesetsService.listTilesets()
  .send()
  .then(resp => {
    console.log(resp.headers);
  }, err => {..});
```

### `MapiError`

If the server responds to your [`MapiRequest`] with an error, or if you abort the request, the `Promise` returned by `send` will reject with a `MapiError`.

`MapiError`s expose the information you'll need to handle and respond to the error.
For example:

- `MapiError.type` exposes the type of error, so you'll know if it was an HTTP error from the server or the request was aborted.
- `MapiError.statusCode` exposes the status code of HTTP errors.
- `MapiError.body` exposes the body of the HTTP response, parsed as JSON if possible.
- `MapiError.message` tells you what went wrong.

For more details, please read [the full `MapiError` documentation](./docs/classes.md#mapierror).

```js
// Check the error.
stylesService.getStyle({..})
  .send()
  .then(response => {..}, error => {
    if (err.type === 'RequestAbortedError') {
      return;
    }
    console.error(error.message);
  });
```

## Services

Please read [the full documentation for services](./docs/services.md).

## Pre-bundled files on unpkg.com

If you aren't using a JS module system, you can use a `<script>` tag referencing pre-bundled files on the CDN [unpkg.com](https://unpkg.com/).

```html
<script src="https://unpkg.com/@mapbox/mapbox-sdk/umd/mapbox-sdk.js"></script>
<script src="https://unpkg.com/@mapbox/mapbox-sdk/umd/mapbox-sdk.min.js"></script>
```

These files are a UMD build of the package, exposing a global `mapboxSdk` function that creates a client, initializes *all* the services, and attaches those services to the client.
Here's how you might use it.

```html
<script src="https://unpkg.com/@mapbox/mapbox-sdk/umd/mapbox-sdk.min.js"></script>
<script>
  var mapboxClient = mapboxSdk({ accessToken: MY_ACCESS_TOKEN });
  mapboxClient.styles.getStyle(..)
    .send()
    .then(..);
  mapboxClient.tilesets.listTilesets(..)
    .send()
    .then(..);
</script>
```

## Development

Please read [`./docs/development.md`](./docs/development.md).

[`got`]: https://github.com/sindresorhus/got

[`http`]: https://nodejs.org/api/http.html

[`xmlhttprequest`]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

[`mapirequest`]: #mapirequest

[`mapiresponse`]: #mapiresponse

[`mapierror`]: #mapierror
