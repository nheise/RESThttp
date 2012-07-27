
var http = require('http');

var InitialRequestProcessor = require('./requestProcessor/InitialRequestProcessor.js').InitialRequestProcessor;
var BasicRequestProcessorChain = require('./requestProcessor/BasicRequestProcessorChain.js').BasicRequestProcessorChain;

exports.createServer = function( configuration, optionalProcessorChain ) {

  var requestProcessorChain = optionalProcessorChain || new BasicRequestProcessorChain();

  var initialRequestProcessor = new InitialRequestProcessor( requestProcessorChain, configuration );

  http.createServer( initialRequestProcessor.createContextAndStartProcess ).listen( configuration.port, configuration.ip );
  
  console.log(configuration.name + ' running at http://' + configuration.ip + ':' + configuration.port + '/');
}
