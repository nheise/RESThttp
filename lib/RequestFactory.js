/**
 * [heisemedia] 2011
 */

var urlParser = require('url');

exports.createRequest = function( requestListener ) {
    return new Request( requestListener );
};

function Request( requestListener ) {
    
    this.requestListener = requestListener;
    
    this.method = requestListener.method;
    
    this.urlInfos = urlParser.parse( requestListener.url );
    
    this.uri = this.urlInfos.pathname;
    
    this.args;
    
    this.acceptMediaTypes = extractAcceptMediaTypesFromRequest(requestListener);
    
    function extractAcceptMediaTypesFromRequest(request) {
        
        var requestAcceptField = request.headers.accept;
        
        var mediaTypesTemp = requestAcceptField.split( "," );

        var mediaTypes = new Array();

        for(var index in mediaTypesTemp) {
            mediaTypes.push( mediaTypesTemp[index].split( ";" ) );
        }
        
        return mediaTypes;
    }
}

