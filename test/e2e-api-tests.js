#!/usr/bin/env node
'use strict';

/**
 * Comprehensive End-to-End API Tests
 *
 * This test suite makes real API calls to all Mapbox services to ensure
 * the SDK can successfully communicate with the live API endpoints.
 *
 * Usage:
 *   node test/e2e-api-tests.js --token YOUR_ACCESS_TOKEN
 *
 * Or set MAPBOX_ACCESS_TOKEN environment variable:
 *   MAPBOX_ACCESS_TOKEN=your_token node test/e2e-api-tests.js
 */

// Handle command line arguments manually to avoid ESM import issues
function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {};
  const input = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.replace('--', '');
      if (key === 'help') {
        showHelp();
        process.exit(0);
      }
      const value =
        args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      flags[key] = value;
      if (value !== true) i++; // Skip next argument if it was used as a value
    } else {
      input.push(arg);
    }
  }

  return { flags, input };
}

function showHelp() {
  console.log(`
Comprehensive End-to-End API Tests

Usage
  node test/e2e-api-tests.js [options]

Options
  --token       Your Mapbox access token
  --service     Run tests for specific service only
  --verbose     Show detailed request/response information
  --timeout     Timeout for each test in milliseconds (default: 10000)

Examples
  node test/e2e-api-tests.js --token pk.your_token_here
  MAPBOX_ACCESS_TOKEN=pk.token node test/e2e-api-tests.js
  node test/e2e-api-tests.js --service geocoding --verbose
`);
}

const mbxClient = require('..');
const mbxDatasets = require('../services/datasets');
const mbxDirections = require('../services/directions');
const mbxGeocoding = require('../services/geocoding');
const mbxGeocodingV6 = require('../services/geocoding-v6');
const mbxIsochrone = require('../services/isochrone');
const mbxMapMatching = require('../services/map-matching');
const mbxMatrix = require('../services/matrix');
const mbxOptimization = require('../services/optimization');
const mbxStatic = require('../services/static');
const mbxStyles = require('../services/styles');
const mbxTilequery = require('../services/tilequery');
const mbxTilesets = require('../services/tilesets');
const mbxTokens = require('../services/tokens');
const mbxUploads = require('../services/uploads');

// CLI setup
const cli = parseArgs();

const accessToken = cli.flags.token || process.env.MAPBOX_ACCESS_TOKEN;
const targetService = cli.flags.service;
const verbose = cli.flags.verbose || false;
const timeout = cli.flags.timeout ? parseInt(cli.flags.timeout) : 10000;

if (!accessToken) {
  console.error('❌ ERROR: Access token required');
  console.error(
    'Use --token flag or set MAPBOX_ACCESS_TOKEN environment variable'
  );
  showHelp();
  process.exit(1);
}

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// Utility functions
function log(message) {
  console.log(`ℹ️  ${message}`);
}

function success(message) {
  console.log(`✅ ${message}`);
}

function error(message) {
  console.log(`❌ ${message}`);
}

function verbose_log(message) {
  if (verbose) {
    console.log(`🔍 ${message}`);
  }
}

async function runTest(testName, testFn) {
  results.total++;
  log(`Running: ${testName}`);

  try {
    const startTime = Date.now();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Test timeout after ${timeout}ms`)),
        timeout
      )
    );

    const result = await Promise.race([testFn(), timeoutPromise]);
    const duration = Date.now() - startTime;

    if (verbose && result && result.body) {
      verbose_log(
        `Response: ${JSON.stringify(result.body, null, 2).substring(0, 500)}...`
      );
    }

    success(`${testName} (${duration}ms)`);
    results.passed++;
    return result;
  } catch (err) {
    error(`${testName}: ${err.message}`);
    results.failed++;
    results.errors.push({ test: testName, error: err.message });
    if (verbose) {
      console.error(err);
    }
  }
}

// Initialize clients
const baseClient = mbxClient({ accessToken });
const services = {
  datasets: mbxDatasets(baseClient),
  directions: mbxDirections(baseClient),
  geocoding: mbxGeocoding(baseClient),
  geocodingV6: mbxGeocodingV6(baseClient),
  isochrone: mbxIsochrone(baseClient),
  mapMatching: mbxMapMatching(baseClient),
  matrix: mbxMatrix(baseClient),
  optimization: mbxOptimization(baseClient),
  static: mbxStatic(baseClient),
  styles: mbxStyles(baseClient),
  tilequery: mbxTilequery(baseClient),
  tilesets: mbxTilesets(baseClient),
  tokens: mbxTokens(baseClient),
  uploads: mbxUploads(baseClient)
};

// Test data and coordinates
const TEST_COORDS = {
  SF: [-122.4194, 37.7749], // San Francisco
  NYC: [-74.006, 40.7128], // New York City
  LONDON: [-0.1276, 51.5074], // London
  TOKYO: [139.6503, 35.6762] // Tokyo
};

// Global test data (will be populated during tests)
let testDatasetId = null;
let testStyleId = null;
let testUploadId = null;

// Test suites
const testSuites = {
  async geocoding() {
    await runTest('Geocoding - Forward geocode', () =>
      services.geocoding
        .forwardGeocode({
          query: 'San Francisco, CA'
        })
        .send()
    );

    await runTest('Geocoding - Forward geocode with options', () =>
      services.geocoding
        .forwardGeocode({
          query: 'coffee near Union Square, San Francisco',
          proximity: TEST_COORDS.SF,
          types: ['poi'],
          limit: 5
        })
        .send()
    );

    await runTest('Geocoding - Reverse geocode', () =>
      services.geocoding
        .reverseGeocode({
          query: TEST_COORDS.SF
        })
        .send()
    );

    await runTest('Geocoding - Reverse geocode with types', () =>
      services.geocoding
        .reverseGeocode({
          query: TEST_COORDS.NYC,
          types: ['address', 'poi']
        })
        .send()
    );
  },

  async geocodingV6() {
    await runTest('Geocoding v6 - Forward geocode', () =>
      services.geocodingV6
        .forwardGeocode({
          query: 'Statue of Liberty, New York'
        })
        .send()
    );

    await runTest('Geocoding v6 - Forward geocode structured', () =>
      services.geocodingV6
        .forwardGeocode({
          mode: 'structured',
          address_line1: '1600 Pennsylvania Avenue',
          place: 'Washington',
          region: 'DC'
        })
        .send()
    );

    await runTest('Geocoding v6 - Reverse geocode', () =>
      services.geocodingV6
        .reverseGeocode({
          longitude: TEST_COORDS.SF[0],
          latitude: TEST_COORDS.SF[1]
        })
        .send()
    );
  },

  async directions() {
    await runTest('Directions - Basic route', () =>
      services.directions
        .getDirections({
          profile: 'driving',
          waypoints: [
            { coordinates: TEST_COORDS.SF },
            { coordinates: TEST_COORDS.NYC }
          ]
        })
        .send()
    );

    await runTest('Directions - Walking route with steps', () =>
      services.directions
        .getDirections({
          profile: 'walking',
          waypoints: [
            { coordinates: [-122.4194, 37.7749] },
            { coordinates: [-122.4094, 37.7849] }
          ],
          steps: true,
          geometries: 'geojson'
        })
        .send()
    );

    await runTest('Directions - Multi-waypoint route', () =>
      services.directions
        .getDirections({
          profile: 'cycling',
          waypoints: [
            { coordinates: TEST_COORDS.SF },
            { coordinates: [-122.4094, 37.7849] },
            { coordinates: [-122.3994, 37.7949] }
          ],
          alternatives: true
        })
        .send()
    );
  },

  async matrix() {
    await runTest('Matrix - Duration matrix', () =>
      services.matrix
        .getMatrix({
          profile: 'driving',
          points: [
            { coordinates: TEST_COORDS.SF },
            { coordinates: TEST_COORDS.NYC },
            { coordinates: TEST_COORDS.LONDON }
          ],
          annotations: ['duration']
        })
        .send()
    );

    await runTest('Matrix - Duration and distance', () =>
      services.matrix
        .getMatrix({
          profile: 'walking',
          points: [
            { coordinates: [-122.4194, 37.7749] },
            { coordinates: [-122.4094, 37.7849] },
            { coordinates: [-122.3994, 37.7949] }
          ],
          annotations: ['duration', 'distance']
        })
        .send()
    );
  },

  async isochrone() {
    await runTest('Isochrone - Time contours', () =>
      services.isochrone
        .getContours({
          coordinates: TEST_COORDS.SF,
          minutes: [10, 20, 30],
          profile: 'walking'
        })
        .send()
    );

    await runTest('Isochrone - Distance contours', () =>
      services.isochrone
        .getContours({
          coordinates: TEST_COORDS.NYC,
          meters: [500, 1000],
          profile: 'cycling'
        })
        .send()
    );
  },

  async mapMatching() {
    // GPS trace coordinates (slightly noisy path)
    const gpsTrace = [
      [-122.4194, 37.7749],
      [-122.4184, 37.7759],
      [-122.4174, 37.7769],
      [-122.4164, 37.7779]
    ];

    await runTest('Map Matching - GPS trace matching', () =>
      services.mapMatching
        .getMatch({
          profile: 'driving',
          points: gpsTrace.map(coord => ({ coordinates: coord })),
          geometries: 'geojson'
        })
        .send()
    );
  },

  async optimization() {
    await runTest('Optimization - Route optimization', () =>
      services.optimization
        .getOptimization({
          profile: 'driving',
          waypoints: [
            { coordinates: TEST_COORDS.SF },
            { coordinates: [-122.4094, 37.7849] },
            { coordinates: [-122.3994, 37.7949] },
            { coordinates: [-122.4294, 37.7649] }
          ],
          roundtrip: true
        })
        .send()
    );
  },

  async static() {
    await runTest('Static - Basic static map', () =>
      services.static
        .getStaticImage({
          ownerId: 'mapbox',
          styleId: 'streets-v11',
          width: 400,
          height: 400,
          position: {
            coordinates: TEST_COORDS.SF,
            zoom: 14
          }
        })
        .send()
    );

    await runTest('Static - Static map with overlay', () =>
      services.static
        .getStaticImage({
          ownerId: 'mapbox',
          styleId: 'satellite-v9',
          width: 600,
          height: 400,
          position: {
            coordinates: TEST_COORDS.NYC,
            zoom: 12
          },
          overlays: [
            {
              marker: {
                coordinates: TEST_COORDS.NYC,
                size: 'small'
              }
            }
          ]
        })
        .send()
    );
  },

  async styles() {
    // Skip list styles test - requires styles:list scope which most tokens don't have
    // await runTest('Styles - List styles', () =>
    //   services.styles.listStyles().send()
    // );

    // Try to get a Mapbox default style
    await runTest('Styles - Get Mapbox style', () =>
      services.styles
        .getStyle({
          styleId: 'streets-v11',
          ownerId: 'mapbox'
        })
        .send()
    );
  },

  async tilequery() {
    await runTest('Tilequery - Query features', () =>
      services.tilequery
        .listFeatures({
          mapIds: ['mapbox.mapbox-streets-v8'],
          coordinates: TEST_COORDS.SF,
          radius: 100
        })
        .send()
    );
  },

  async tilesets() {
    // Skip tileset management tests - require tilesets:list scope which most tokens don't have
    // await runTest('Tilesets - List tilesets', () =>
    //   services.tilesets.listTilesets().send()
    // );

    // await runTest('Tilesets - List tileset sources', () =>
    //   services.tilesets.listTilesetSources().send()
    // );

    // Try to get metadata for a known public tileset
    await runTest('Tilesets - Get tileset metadata', () =>
      services.tilesets
        .tileJSONMetadata({
          tilesetId: 'mapbox.mapbox-streets-v8'
        })
        .send()
    );
  },

  async tokens() {
    // Skip list tokens test - endpoint may not be available or requires special scope
    // await runTest('Tokens - List tokens', () =>
    //   services.tokens.listTokens().send()
    // );

    await runTest('Tokens - Get current token info', () =>
      services.tokens.getToken().send()
    );

    // Skip list scopes test - requires scopes:list scope which most tokens don't have
    // await runTest('Tokens - List scopes', () =>
    //   services.tokens.listScopes().send()
    // );
  },

  async uploads() {
    await runTest('Uploads - List uploads', () =>
      services.uploads.listUploads().send()
    );
  },

  async datasets() {
    await runTest('Datasets - List datasets', () =>
      services.datasets.listDatasets().send()
    );

    // Create a test dataset
    const dataset = await runTest('Datasets - Create dataset', () =>
      services.datasets
        .createDataset({
          name: 'E2E Test Dataset',
          description: 'Created by end-to-end API tests'
        })
        .send()
    );

    if (dataset && dataset.body && dataset.body.id) {
      testDatasetId = dataset.body.id;

      await runTest('Datasets - Get dataset metadata', () =>
        services.datasets
          .getMetadata({
            datasetId: testDatasetId
          })
          .send()
      );

      // Add a test feature
      await runTest('Datasets - Add feature', () =>
        services.datasets
          .putFeature({
            datasetId: testDatasetId,
            featureId: 'test-feature-1',
            feature: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: TEST_COORDS.SF
              },
              properties: {
                name: 'Test Point',
                description: 'Added by E2E tests'
              }
            }
          })
          .send()
      );

      await runTest('Datasets - List features', () =>
        services.datasets
          .listFeatures({
            datasetId: testDatasetId
          })
          .send()
      );

      await runTest('Datasets - Get feature', () =>
        services.datasets
          .getFeature({
            datasetId: testDatasetId,
            featureId: 'test-feature-1'
          })
          .send()
      );

      // Cleanup: Delete the test dataset
      await runTest('Datasets - Delete dataset', () =>
        services.datasets
          .deleteDataset({
            datasetId: testDatasetId
          })
          .send()
      );
    }
  }
};

// Main execution
async function runTests() {
  console.log('🚀 Starting Mapbox SDK End-to-End API Tests');
  console.log(`📊 Token: ${accessToken.substring(0, 20)}...`);
  console.log(`🔧 Target service: ${targetService || 'all'}`);
  console.log(`⏱️  Timeout: ${timeout}ms per test`);
  console.log('─'.repeat(60));

  const startTime = Date.now();

  if (targetService) {
    if (testSuites[targetService]) {
      await testSuites[targetService]();
    } else {
      error(`Unknown service: ${targetService}`);
      console.log(`Available services: ${Object.keys(testSuites).join(', ')}`);
      process.exit(1);
    }
  } else {
    // Run all test suites
    for (const [serviceName, testSuite] of Object.entries(testSuites)) {
      console.log(`\n📦 Testing ${serviceName.toUpperCase()} service`);
      console.log('─'.repeat(40));
      await testSuite();
    }
  }

  const totalTime = Date.now() - startTime;

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Total tests: ${results.total}`);
  console.log(`Passed: ${results.passed} ✅`);
  console.log(`Failed: ${results.failed} ❌`);
  console.log(
    `Success rate: ${Math.round((results.passed / results.total) * 100)}%`
  );
  console.log(`Total time: ${Math.round(totalTime / 1000)}s`);

  if (results.errors.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.errors.forEach(({ test, error }) => {
      console.log(`  • ${test}: ${error}`);
    });
  }

  console.log('═'.repeat(60));

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  error(`Unexpected error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
