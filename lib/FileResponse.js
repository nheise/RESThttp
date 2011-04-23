
var util = require('util');
var events = require('events');

var fs = require( 'fs' );
var response = require( './Response.js' );
var fileReaderFactory = require( './FileReader.js' );

var HEADER_RANGE_FIELD_REGEXP = new RegExp( '^bytes=(\\d.*)-(\\d.*)?' );

exports.createFileResponse = function( header, encoding ) {
    return new FileResponse( header, encoding );
};

function FileResponse( header, encoding ) {

    var self = this;
    
    var ERROR_EVENT = "error";
    var PARTIAL_CONTENT_EVENT = "partial_content";
    var CONTENT_EVENT = "content";
    var END_EVENT = "end";

    function shouldSendContentInParts( request ) {
        return request.headers['range'] ? true : false;
    }

    function extractRangeFromRequestHeader( requestHeaderRangeField ) {
        var hits = requestHeaderRangeField.match( HEADER_RANGE_FIELD_REGEXP );
        return {
            begin : hits[1] ? parseInt( hits[1] ) : null,
            end : hits[2] ? parseInt( hits[2] ) : null
        };
    }

    function buildContentRangeString( size, offestPosition, endPosition ) {
        return 'bytes ' + offestPosition + '-'
                + ( endPosition ? endPosition : size - 1 ) + '/' + size;
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
            self.emit(ERROR_EVENT, header, err);
        } );
        
        fileReader.onClose( function() {
            self.emit(END_EVENT);
        } );

        if( requestRange ) {

            var range = extractRangeFromRequestHeader( requestRange );

            fileReader.onData( function( buffer, bytesRead, contentLength ) {
                
                header.setContentLength( bytesRead );
                header.setContentRange( buildContentRangeString( contentLength,
                                                                 range.begin,
                                                                 range.end ) );
                
                self.emit(PARTIAL_CONTENT_EVENT, header, buffer, encoding);
            } );

            fileReader.readFromPositionToPosition( filePath, range.begin, range.end );
        }
        else {

            fileReader.onData( function( data, contentLength ) {
                
                header.setContentLength( contentLength );
                
                self.emit(CONTENT_EVENT, header, data, encoding);
            } );

            fileReader.read( filePath );
        }
    };
    
    this.onError = function(callback) {
        this.addListener(ERROR_EVENT, callback);
    };
    
    this.onContent = function(callback) {
        this.addListener(CONTENT_EVENT, callback);
    };
    
    this.onPartialContent = function(callback) {
        this.addListener(PARTIAL_CONTENT_EVENT, callback);
    };
    
    this.onEnd = function(callback) {
        this.addListener(END_EVENT, callback);
    };
}

util.inherits(FileResponse, events.EventEmitter);
