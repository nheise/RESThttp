
var configuration = require('./Configuration.js');
var server = configuration.server;

var requestProcessor = require('./lib/RequestProcessor.js');

var http = require('http');

http.createServer(requestProcessor.processRequest).listen(server.port, server.ip);
console.log(server.name + ' running at http://' + server.ip + ':' + server.port + '/');


