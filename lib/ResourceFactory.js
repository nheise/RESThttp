/**
 * [heisemedia] 2011
 */

var uriPatternFactory = require("./URIPattern.js");

exports.createResource = function ( path ) {
    return new Resource( path );
};

function Resource( path ) {
    
    this.uriPattern = uriPatternFactory.create( path );
    
    this.GET = {};
    
    this.addMediaTypeAndResponseLoaderForRequestMethodGET = function ( mediaType, responseLoader ) {
      this.GET[mediaType] = responseLoader;  
    };
    
    this.supportRequestMethod = function( requestMethod ) {
        for (var index in this[requestMethod]) {
            return true;
        }
        return false;
    };
    
    this.findMediaTypeResourceCanRespond = function(requestMethod, requestMediaTypes) {
        for(index in requestMediaTypes) {
            var requestMediaType = requestMediaTypes[index][0];
            if(this[requestMethod][requestMediaType] != undefined) {
                return requestMediaType;
            }
        }
    };
    
}