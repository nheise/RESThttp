/**
 * [heisemedia] 2011
 */

var mediaType = require('./MediaType.js');

var httpResponseHeader = require('./HTTPResponseHeader.js');

var response = require('./Response.js');

var resourceRepository = require('./ResourceRepository.js').createRepository();
resourceRepository.addResources(require('../resources/testResource/testResource.js').resources);

exports.processRequest = function (request, responseStream) {

    console.log(request.headers);
    console.log(request.url);
    
    try {
        var resource = resourceRepository.findResourceForRequest(request);
        if(resource) {
            if(resource.supportRequestMethod( request.method )) {
                var requestMediaTypes = extractAcceptMediaTypesFromRequest(request);
                var mediaTypeResourceCanRespond = resource.findMediaTypeResourceCanRespond( request.method, requestMediaTypes );
                if(mediaTypeResourceCanRespond) {
                    var args = resource.uriPattern.resolve(request.url);
                    resource[request.method][mediaTypeResourceCanRespond](request, responseStream, args);
                }
                else {
                    var header = httpResponseHeader.createHTTPResponseHeader(mediaType.TEXT_PLAIN);
                    response.send415(responseStream, header);
                }
            }
            else{
                var header = httpResponseHeader.createHTTPResponseHeader(mediaType.TEXT_PLAIN);
                response.send405(responseStream, header);
            }
        }
        else {
            var header = httpResponseHeader.createHTTPResponseHeader(mediaType.TEXT_PLAIN);
            response.send404(responseStream, header);
        }
    }
    catch(e) {
        console.log(e);
        var header = httpResponseHeader.createHTTPResponseHeader(mediaType.TEXT_PLAIN);
        response.send500(responseStream, header);
    }
};

function findMediaTypeResourceCanRespond(resourceMethode, requestMediaTypes) {
    for(index in requestMediaTypes) {
        var requestMediaType = requestMediaTypes[index][0];
        if(resourceMethode[requestMediaType] != undefined) {
            return requestMediaType;
        }
    }
}

function extractAcceptMediaTypesFromRequest(request) {
    
    var requestAcceptField = request.headers.accept;
    
    var mediaTypesTemp = requestAcceptField.split( "," );

    var mediaTypes = new Array();

    for(var index in mediaTypesTemp) {
        mediaTypes.push( mediaTypesTemp[index].split( ";" ) );
    }
    
    return mediaTypes;
}