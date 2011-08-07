
var server = require('../Configuration.js').server;

exports.createHTTPResponseHeader = function(contentType) {
    return new HTTPResponseHeader(contentType);
};

function HTTPResponseHeader(contentType) {
	
	var httpResponseHeaderFields = {};
	
	httpResponseHeaderFields['server'] = server.name;
	httpResponseHeaderFields['date'] = (new Date()).toGMTString();
	httpResponseHeaderFields['content-type'] = contentType;

	this.getFields = function() {
		return httpResponseHeaderFields;
	};

	this.setLastModified = function(date) {
		httpResponseHeaderFields['last-modified'] = date;
	};
    
    this.setContentType = function(contentType) {
		httpResponseHeaderFields['content-type'] = contentType;
	};
	
	this.setContentLength = function(contentLength) {
		httpResponseHeaderFields['content-length'] = contentLength;
	};
	
	this.setContentRange = function(contentRange) {
		httpResponseHeaderFields['content-range'] = contentRange;
	};
	
	this.setAcceptRanges = function(value) {
		httpResponseHeaderFields['accept-ranges'] = value;
	};
	
	this.setCacheControl = function(value) {
		httpResponseHeaderFields['cache-control'] = value;
	};
	
	this.setExpires = function(value) {
		httpResponseHeaderFields['expires'] = value;
	};

	this.setEtag = function(value) {
		httpResponseHeaderFields['etag'] = value;
	};
	
}
