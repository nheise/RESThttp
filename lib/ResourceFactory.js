/**
 * [heisemedia] 2011
 */

exports.createResource = function ( path ) {
    return new Resource( path );
};

function Resource( path ) {
	
	this.path = path;
    
    this.GET = {};
    
    this.addMediaTypeAndResponseLoaderForRequestMethodGET = function ( mediaType, responseLoader ) {
      this.GET[mediaType] = responseLoader;  
    };
    
    this.supportRequestMethod = function( requestMethod ) {
        return this[requestMethod] ? true : false;
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