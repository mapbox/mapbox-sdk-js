# @mapbox/mapbox-sdk

A JS SDK for accessing [Mapbox APIs](https://github.com/mapbox/api-documentation).

Works both in Node and the browser.

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
- [Development](#development)

## Installation

```
npm install @mapbox/mapbox-sdk
```

**If you are supporting older browsers, you will need a Promise polyfill.**
[es6-promise](https://github.com/stefanpenner/es6-promise) is a good one, if you're uncertain.

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

You may also **share one configuration between multiple services**.
To do that, initialize a base client and then pass *that* into each service factory functions.

```js
const mbxClient = require('@mapbox/mapbox-sdk');
const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const mbxTilesets = require('@mapbox/mapbox-sdk/services/tilesets');

const baseClient = mbxClient({ accessToken: MY_ACCESS_TOKEN });
const stylesService = mbxStyles(baseClient);
const tilesetsService = mbxTilesets(baseClient);
```

### Creating and sending requests

To **create a request**, invoke a service method on a service client.

Once you've created a request, **send the request** with its `send` method.

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

Typically, you use `MapiResponse.body` to access the parsed API response.

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

## Development

Please read [`./docs/development.md`](./docs/development.md).

[`got`]: https://github.com/sindresorhus/got

[`http`]: https://nodejs.org/api/http.html

[`xmlhttprequest`]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest

[`mapirequest`]: #mapirequest

[`mapiresponse`]: #mapiresponse

[`mapierror`]: #mapierror
