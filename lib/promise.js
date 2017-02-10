'use strict';

// Installs ES6 Promise polyfill if a native Promise is not available

if (typeof Promise === 'undefined') {
  require('es6-promise').polyfill();
}

module.export = Promise;
