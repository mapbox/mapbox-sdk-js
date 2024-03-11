'use strict';

var xtend = require('xtend');
var fs = require('fs');
var got = require('got');
var FormData = require('form-data');
var MapiResponse = require('../classes/mapi-response');
var MapiError = require('../classes/mapi-error');
var constants = require('../constants');

var methodsWithBodies = new Set(['PUT', 'PATCH', 'POST']);

// Keys are request IDs, values are objects with
// clientRequest and gotStream properties.
var requestsUnderway = {};

function nodeAbort(request) {
  var streams = requestsUnderway[request.id];
  if (!streams) return;
  streams.clientRequest.abort();
  delete requestsUnderway[request.id];
}

function normalizeGotProgressEvent(progress) {
  return xtend(progress, {
    percent: progress.percent * 100
  });
}

function createRequestStreams(request) {
  var url = request.url(request.client.accessToken);
  var gotOptions = {
    method: request.method,
    headers: request.headers,
    retries: 0,
    followRedirect: false,
    throwHttpErrors: false
  };

  if (typeof request.file === 'string') {
    if (request.sendFileAs && request.sendFileAs === 'form') {
      const form = new FormData();
      form.append('file', fs.createReadStream(request.file));
      gotOptions.body = form;
    } else {
      gotOptions.body = fs.createReadStream(request.file);
    }
  } else if (request.file && request.file.pipe) {
    if (request.sendFileAs && request.sendFileAs === 'form') {
      const form = new FormData();
      form.append('file', request.file);
      gotOptions.body = form;
    } else {
      gotOptions.body = request.file;
    }
  } else if (typeof request.body === 'string') {
    // matching service needs to send a www-form-urlencoded request
    gotOptions.body = request.body;
  } else if (request.body) {
    gotOptions.body = JSON.stringify(request.body);
  }

  if (
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) &&
    !request.body
  ) {
    gotOptions.body = '';
  }

  var gotStream = got.stream(url, gotOptions);

  gotStream.setEncoding(request.encoding);

  gotStream.on('downloadProgress', function(progress) {
    request.emitter.emit(
      constants.EVENT_PROGRESS_DOWNLOAD,
      normalizeGotProgressEvent(progress)
    );
  });
  gotStream.on('uploadProgress', function(progress) {
    request.emitter.emit(
      constants.EVENT_PROGRESS_UPLOAD,
      normalizeGotProgressEvent(progress)
    );
  });

  return new Promise(function(resolve) {
    gotStream.on('request', function(req) {
      var clientRequest = req;
      var streams = { clientRequest: clientRequest, gotStream: gotStream };
      requestsUnderway[request.id] = streams;
      resolve(streams);
    });

    // Got will not end the stream for methods that *can* have
    // bodies if you don't provide a body, so we'll do it manually.
    if (
      methodsWithBodies.has(request.method) &&
      gotOptions.body === undefined
    ) {
      gotStream.end();
    }
  });
}

function nodeSend(request) {
  return Promise.resolve()
    .then(function() {
      return createRequestStreams(request);
    })
    .then(function(result) {
      return sendStreams(result.gotStream, result.clientRequest);
    });

  function sendStreams(gotStream, clientRequest) {
    return new Promise(function(resolve, reject) {
      var errored = false;
      clientRequest.on('abort', function() {
        var mapiError = new MapiError({
          request: request,
          type: constants.ERROR_REQUEST_ABORTED
        });
        errored = true;
        reject(mapiError);
      });

      var httpsResponse = void 0;
      var statusCode = void 0;
      gotStream.on('response', function(res) {
        httpsResponse = res;
        statusCode = res.statusCode;
      });

      var body = '';
      gotStream.on('data', function(chunk) {
        body += chunk;
      });

      gotStream.on('end', function() {
        if (errored || !httpsResponse) return;

        if (statusCode < 200 || statusCode >= 400) {
          var mapiError = new MapiError({
            request: request,
            body: body,
            statusCode: statusCode
          });
          reject(mapiError);
          return;
        }

        try {
          var response = new MapiResponse(request, {
            body: body,
            headers: httpsResponse.headers,
            statusCode: httpsResponse.statusCode
          });
          resolve(response);
        } catch (responseError) {
          reject(responseError);
        }
      });

      gotStream.on('error', function(error) {
        errored = true;
        reject(error);
      });
    });
  }
}

module.exports = {
  nodeAbort: nodeAbort,
  nodeSend: nodeSend
};
