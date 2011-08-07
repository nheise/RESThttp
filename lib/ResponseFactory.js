/**
 * [heisemedia] 2011
 */

var mediaType = require('./MediaType.js');

var httpResponseHeader = require('./HTTPResponseHeader.js');

exports.create = function( response ) {
    return new Response( response );
};

function Response( response ) {
    
    var self = this;
    
    this.header = httpResponseHeader.createHTTPResponseHeader(mediaType.TEXT_PLAIN);
    
    this.send200 = function( data, encoding ) {
        send( 200, 'OK', data, encoding );
    };

    this.send206 = function( data, encoding ) {
        send( 206, 'Partial Content', data, encoding );
    };

    this.send404 = function( header ) {
        console.log( "Have 404 !!!" );
        sendOnlyHeader( 404, 'Not Found' );
    };

    this.send405 = function( header ) {
        console.log( "Have 405 !!!" );
        sendOnlyHeader( 405, 'Method Not Allowed.' );
    };

    this.send406 = function( header ) {
        console.log( "Have 406 !!!" );
        sendOnlyHeader( 406, 'Not Acceptable.' );
    };

    this.send415 = function( header ) {
        console.log( "Have 415 !!!" );
        sendOnlyHeader( 415, 'Unsupported Media Type.' );
    };

    this.send500 = function( header ) {
        console.log( "Have 500 !!!" );
        sendOnlyHeader( 500, 'Internal Server Error.' );
    };

    function send( httpStatusCode, reasonPhrase, data, encoding ) {
        /*
         * console.log(request.url); console.log(request.headers);
         * console.log(self.header.getFields());
         */
        response.writeHead( httpStatusCode, reasonPhrase, self.header.getFields() );
        response.end( data ? data : "", encoding );
    }

    function sendOnlyHeader( httpStatusCode, reasonPhrase ) {
        response.writeHead( httpStatusCode, reasonPhrase, self.header.getFields() );
        response.end();
    }
    
}


