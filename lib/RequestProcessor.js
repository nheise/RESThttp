/**
 * [heisemedia] 2011
 */

var requestFactory = require('./RequestFactory.js');

var mediaType = require('./MediaType.js');

var httpResponseHeader = require('./HTTPResponseHeader.js');

var response = require('./Response.js');

var resourceRepository = require('./ResourceRepository.js').createRepository();
resourceRepository.addResources(require('../resources/testResource/testResource.js').resources);

exports.processRequest = function ( requestListener, responseStream ) {

    console.log(requestListener.headers);
    console.log(requestListener.url);
    
    try {
        var request = requestFactory.createRequest( requestListener );
        var resource = resourceRepository.findResourceForURI( request.uri );
        if( resource ) {
            if( resource.supportRequestMethod( request.method ) ) {
                var mediaTypeResourceCanRespond = resource.findMediaTypeResourceCanRespond( request.method, request.acceptMediaTypes );
                if(mediaTypeResourceCanRespond) {
                    request.args = resource.uriPattern.resolve( request.uri );
                    resource[request.method][mediaTypeResourceCanRespond](request, responseStream);
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

