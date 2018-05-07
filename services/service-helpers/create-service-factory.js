'use strict';

function createServiceFactory(ServicePrototype) {
  return function(client) {
    var service = Object.create(ServicePrototype);
    service.client = client;
    return service;
  };
}

module.exports = createServiceFactory;
