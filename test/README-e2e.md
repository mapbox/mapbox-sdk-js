# End-to-End API Tests

This directory contains comprehensive end-to-end tests that make real API calls to all Mapbox services to verify the SDK functionality against live endpoints.

## Quick Start

```bash
# Run all tests
npm run test:e2e -- --token YOUR_MAPBOX_ACCESS_TOKEN

# Or use environment variable
MAPBOX_ACCESS_TOKEN=pk.your_token_here npm run test:e2e

# Run specific service tests only
npm run test:e2e -- --token YOUR_TOKEN --service geocoding

# Verbose output with request/response details
npm run test:e2e -- --token YOUR_TOKEN --verbose
```

## Available Options

- `--token` - Your Mapbox access token (required)
- `--service` - Test specific service only (optional)
- `--verbose` - Show detailed request/response information
- `--timeout` - Set timeout per test in milliseconds (default: 10000)

## Test Coverage

The e2e tests cover **64 API methods** across **14 services**:

### 🌍 Search Services
- **Geocoding** (4 tests): Forward/reverse geocoding with various options
- **Geocoding v6** (3 tests): Next-generation geocoding API

### 🗺️ Navigation Services  
- **Directions** (3 tests): Route planning with different profiles
- **Matrix** (2 tests): Travel time/distance matrices
- **Isochrone** (2 tests): Reachability contours
- **Map Matching** (1 test): GPS trace to road alignment
- **Optimization** (1 test): Route optimization (TSP solver)

### 🎨 Map Services
- **Styles** (2 tests): Style management and retrieval
- **Static** (2 tests): Static map image generation
- **Tilequery** (1 test): Feature querying from vector tiles
- **Tilesets** (3 tests): Tileset management and metadata

### 📊 Data Services
- **Datasets** (6 tests): Complete CRUD operations on datasets
- **Uploads** (1 test): File upload status tracking

### 🔧 Account Services
- **Tokens** (3 tests): Access token management and scopes

## Success Criteria

Each test is considered successful when:
- ✅ API call completes without errors
- ✅ Response is received within timeout (default 10s)
- ✅ Response structure matches expected format
- ✅ HTTP status indicates success

## Example Output

```
🚀 Starting Mapbox SDK End-to-End API Tests
📊 Token: pk.eyJ1IjoibWFwYm94...
🔧 Target service: all
⏱️  Timeout: 10000ms per test
────────────────────────────────────────────────────────────

📦 Testing GEOCODING service
────────────────────────────────────
ℹ️  Running: Geocoding - Forward geocode
✅ Geocoding - Forward geocode (1247ms)
ℹ️  Running: Geocoding - Forward geocode with options  
✅ Geocoding - Forward geocode with options (856ms)
...

════════════════════════════════════════════════════════════
📊 TEST SUMMARY
════════════════════════════════════════════════════════════
Total tests: 39
Passed: 39 ✅
Failed: 0 ❌
Success rate: 100%
Total time: 45s
════════════════════════════════════════════════════════════
```

## Test Data

Tests use safe, non-destructive data:
- **Coordinates**: Major cities (SF, NYC, London, Tokyo)  
- **Queries**: Well-known places and addresses
- **Datasets**: Temporary datasets that are created and cleaned up
- **Routes**: Short routes between test coordinates

## Rate Limiting

These tests make real API calls and will count against your account's rate limits. The default timeout of 10 seconds per test helps prevent hitting rate limits too aggressively.

## Troubleshooting

**Authentication Errors**: Ensure your access token has the required scopes for all services being tested.

**Timeout Errors**: Increase timeout with `--timeout 20000` for slower connections.

**Rate Limit Errors**: Space out test runs or increase timeout between requests.

**Service-Specific Failures**: Use `--service servicename` to isolate and debug individual services.

## Integration with CI/CD

The tests exit with appropriate codes:
- Exit code 0: All tests passed
- Exit code 1: One or more tests failed

Example CI usage:
```bash
# Fail the build if any API tests fail
MAPBOX_ACCESS_TOKEN=$MAPBOX_TOKEN npm run test:e2e --verbose
```