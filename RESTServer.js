
var configuration = require('./Configuration.js');
var server = configuration.server;

var resourceRepository = require('./lib/ResourceRepository.js').createRepository( './' + configuration.RESOURCE_DIR_NAME );

var requestProcessor = require('./lib/RequestProcessor.js');
requestProcessor.setResourceRepository( resourceRepository );

var http = require('http');

http.createServer(requestProcessor.processRequest).listen(server.port, server.ip);
console.log(server.name + ' running at http://' + server.ip + ':' + server.port + '/');


