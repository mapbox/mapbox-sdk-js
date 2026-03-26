# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                  # Run lint + all Jest tests
npm run lint              # Run ESLint + remark markdown linter
npm run format            # Format code with Prettier

# Run a specific test file
npx jest services/__tests__/styles.test.js

# Run tests matching a name pattern
npx jest --testNamePattern="getStyle"

npm run bundle            # Build UMD bundle + minified output
npm run document          # Generate JSDoc API docs
```

Note: `npm test` runs `lint` as a pretest hook before Jest. To run tests without linting, use `npx jest` directly.

## Architecture

This is a **universal JavaScript SDK** for Mapbox REST APIs, targeting Node.js, browsers, and React Native.

### Core Layers

**Client (`lib/`)**
- `lib/client.js` — Entry point; routes to Node or browser client
- `lib/classes/mapi-client.js` — Base client; holds access token and origin config
- `lib/classes/mapi-request.js` — Request abstraction; builds URLs, calls `.send()`, supports `.abort()`
- `lib/classes/mapi-response.js` — Response wrapper with pagination helpers (`hasNextPage()`, `nextPage()`)
- `lib/classes/mapi-error.js` — Error types (HTTP errors, aborted requests)
- `lib/node/node-layer.js` — Node HTTP via `got`; supports streaming, file upload progress events
- `lib/browser/browser-layer.js` — Browser HTTP via XMLHttpRequest

The `package.json` `"browser"` field remaps `lib/client.js` → `lib/browser/browser-client.js` so bundlers automatically pick the right implementation.

**Services (`services/`)**
Each file (e.g., `services/styles.js`, `services/geocoding.js`) wraps one Mapbox API. All follow the same pattern:

```js
var Styles = {};

Styles.getStyle = function(config) {
  v.assertShape({ styleId: v.required(v.string), ... })(config);  // validate input
  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId/:styleId',
    params: pick(config, ['ownerId', 'styleId']),
    query: { ... }
  });
};

module.exports = createServiceFactory(Styles);
```

Service methods return a `MapiRequest` — not a Promise. Callers chain `.send()` to get a Promise.

**Usage:**
```js
const mbxClient = require('@mapbox/mapbox-sdk')({ accessToken });
const stylesService = require('@mapbox/mapbox-sdk/services/styles')(mbxClient);
stylesService.getStyle({ styleId: 'foo' }).send().then(response => { ... });
```

### Testing Approach

- **Unit tests** live in `services/__tests__/` and `lib/classes/__tests__/` — use a mocked client (`test/test-utils.js#mockClient`), verify request config, no network calls
- **Integration tests** live in `test/` — run against a real in-process Express mock server (`mockServer()`), test full request/response cycle including pagination and error handling
- Coverage collected from `lib/**/*.js` and `services/**/*.js`
