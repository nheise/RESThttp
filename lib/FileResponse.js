
var util = require('util');
var events = require('events');

var fs = require( 'fs' );
var fileReaderFactory = require( './FileReader.js' );

var HEADER_RANGE_FIELD_REGEXP = new RegExp( '^bytes=(\\d.*)?-(\\d.*)?' );

exports.createFileResponse = function( header, encoding ) {
    return new FileResponse( header, encoding );
};

function FileResponse( header, encoding ) {

    var self = this;
    
    var ERROR_EVENT = "error";
    var PARTIAL_CONTENT_EVENT = "partial_content";
    var CONTENT_EVENT = "content";
    var END_EVENT = "end";

    function shouldSendContentInParts( requestHeaders ) {
        return requestHeaders['range'] ? true : false;
    }

    function extractRangeFromRequestHeader( requestHeaderRangeField ) {
        var hits = requestHeaderRangeField.match( HEADER_RANGE_FIELD_REGEXP );
        
        var offset = hits[1] ? parseInt( hits[1] ) : 0;
        var length = hits[2] ? parseInt( hits[2] ) + 1 - offset : null;
        
        return {
            offset : offset,
            length : length
        };
    }

    function buildContentRangeString( size, range ) {
       var endPosition = range.length ? range.length + range.offset -1 : size - 1;
       return 'bytes ' + range.offset + '-' + endPosition + '/' + size;
    }
    
    function nowPlusMillis( millis ) {
        return new Date( Date.parse( new Date() ) +  millis );
    }

    this.loadData = function( filePath, requestRange ) {
        
        header.setCacheControl( 'max-age=21600' );
        header.setAcceptRanges( 'bytes' );
        header.setExpires( nowPlusMillis( 6 * 3600000 ).toGMTString() );
        
        var fileReader = fileReaderFactory.createFileReader();

        fileReader.onError( function( err ) {
            self.emit(ERROR_EVENT, err);
        } );
        
        fileReader.onClose( function() {
            self.emit(END_EVENT);
        } );

        if( requestRange ) {

            var range = extractRangeFromRequestHeader( requestRange );

            fileReader.onData( function( buffer, bytesRead, contentLength ) {
                
                header.setContentLength( bytesRead );
                header.setContentRange( buildContentRangeString( contentLength,
                                                                 range ) );
                
                self.emit(PARTIAL_CONTENT_EVENT, buffer, encoding);
            } );

            fileReader.read( filePath, range );
        }
        else {

            fileReader.onData( function( data, contentLength ) {
                
                header.setContentLength( contentLength );
                
                self.emit(CONTENT_EVENT, data, encoding);
            } );

            fileReader.read( filePath );
        }
    };
    
    this.onError = function(callback) {
        this.on(ERROR_EVENT, callback);
    };
    
    this.onContent = function(callback) {
        this.on(CONTENT_EVENT, callback);
    };
    
    this.onPartialContent = function(callback) {
        this.on(PARTIAL_CONTENT_EVENT, callback);
    };
    
    this.onEnd = function(callback) {
        this.on(END_EVENT, callback);
    };
}

util.inherits(FileResponse, events.EventEmitter);
