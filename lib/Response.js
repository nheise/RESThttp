
exports.send200 = function(response, header, data, encoding) {
    send( response, 200, header, 'OK', data, encoding);
};

exports.send206 = function(response, header, data, encoding) {
    send( response, 206, header, 'Partial Content', data, encoding);
};

exports.send404 = function(response, header) {
    sendOnlyHeader(response, 404, header, 'Not Found');
};

exports.send405 = function(response, header) {
    sendOnlyHeader(response, 405, header, 'Method Not Allowed.');
};

exports.send406 = function(response, header) {
    sendOnlyHeader(response, 406, header, 'Not Acceptable.');
};

exports.send415 = function(response, header) {
    sendOnlyHeader(response, 415, header, 'Unsupported Media Type.');
};

exports.send500 = function(response, header) {
    sendOnlyHeader(response, 500, header, 'Internal Server Error.');
};

function send(response, httpStatusCode, header, reasonPhrase, data, encoding) {
/*		
    console.log(request.url);
    console.log(request.headers);
    console.log(header.getFields());
*/
    response.writeHead(httpStatusCode, reasonPhrase, header.getFields());
    response.end(data ? data : "", encoding);
}
	
function sendOnlyHeader(response, httpStatusCode, header, reasonPhrase) {
    response.writeHead(httpStatusCode, reasonPhrase, header.getFields());
    response.end();
}
