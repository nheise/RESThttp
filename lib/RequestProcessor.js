/**
 * [heisemedia] 2011
 */

var requestFactory = require('./RequestFactory.js');
var responseFactory = require('./ResponseFactory.js');

var resourceRepository = require('./ResourceRepository.js').repository;

exports.processRequest = function( requestListener, responseStream ) {

    console.log(requestListener.headers);
    console.log(requestListener.url);
    
    var request = requestFactory.createRequest( requestListener );
    var response = responseFactory.create( responseStream );
    
    try {
        
        var resource = resourceRepository.findResourceForURI( request.uri );
        
        if( resource ) {
            if( resource.supportRequestMethod( request.method ) ) {
                var mediaTypeResourceCanRespond = resource.findMediaTypeResourceCanRespond( request.method, request.acceptMediaTypes );
                if(mediaTypeResourceCanRespond) {
                    request.args = resource.uriPattern.resolve( request.uri );
                    resource[request.method][mediaTypeResourceCanRespond](request, response);
                }
                else {
                    response.send415();
                }
            }
            else{
                response.send405();
            }
        }
        else {
            response.send404();
        }
    }
    catch(e) {
        console.log(e);
        response.send500();
    }
};
/*
function findMediaTypeResourceCanRespond(resourceMethode, requestMediaTypes) {
    for(index in requestMediaTypes) {
        var requestMediaType = requestMediaTypes[index][0];
        if(resourceMethode[requestMediaType] != undefined) {
            return requestMediaType;
        }
    }
}
*/
