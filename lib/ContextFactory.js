
var requestFactory = require('./RequestFactory.js');
var responseFactory = require('./ResponseFactory.js');
var headerUtil = require('./HTTPHeaderUtil.js');

exports.create = function( requestListener, responseStream, serverConfiguration ) {

  var response = responseFactory.create();
  response.headers[headerUtil.keys.SERVER] = serverConfiguration.name;

  return {
    'request' : requestFactory.create( requestListener ),
    'response' : response,
    'requestListener' : requestListener,
    'responseStream' : responseStream,
    'serverConfiguration' : serverConfiguration
  }
}
