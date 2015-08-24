if (process.browser) {
  process.hrtime = require('browser-process-hrtime');
  process.stdout = require('browser-stdout')({ label: false });
}
