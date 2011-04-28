/**
 * [heisemedia] 2011
 */

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
            if(resourceSupportRequestMethode(resource, request.method)) {
                var requestMediaTypes = extractAcceptMediaTypesFromRequest(request);
                var mediaTypeResourceCanRespond = findMediaTypeResourceCanRespond(resource[request.method], requestMediaTypes);
                if(foundMediaType(mediaTypeResourceCanRespond)) {
                    var args = resource.uriPattern.resolve(request.url);
                    resource[request.method][mediaTypeResourceCanRespond](request, responseStream, args);
                }
                else {
                    var header = httpResponseHeader.createHTTPResponseHeader('text/plain');
                    response.send415(responseStream, header);
                }
            }
            else{
                var header = httpResponseHeader.createHTTPResponseHeader('text/plain');
                response.send405(responseStream, header);
            }
        }
        else {
            var header = httpResponseHeader.createHTTPResponseHeader('text/plain');
            response.send404(responseStream, header);
        }
    }
    catch(e) {
        console.log(e);
        var header = httpResponseHeader.createHTTPResponseHeader('text/plain');
        response.send500(responseStream, header);
    }
};

function foundMediaType(mediaTypeResourceCanRespond) {
    return mediaTypeResourceCanRespond != undefined;
}

function findMediaTypeResourceCanRespond(resourceMethode, requestMediaTypes) {
    for(index in requestMediaTypes) {
        var requestMediaType = requestMediaTypes[index][0];
        if(resourceMethode[requestMediaType] != undefined) {
            return requestMediaType;
        }
    }
}

function resourceSupportRequestMethode(resource, requestMethod) {
//  console.log(resource + " # " + requestMethod + " # " + resource[requestMethod]);
    return resource[requestMethod] != undefined;
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