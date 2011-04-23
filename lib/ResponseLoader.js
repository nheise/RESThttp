
var mediaType = require('./MediaType.js');
var fileResponse = require('./FileResponse.js');
var response = require('./Response.js');

var httpResponseHeader = require( './HTTPResponseHeader.js' );

var FILE_PATH = './resource';

exports.responseLoader = new ResponseLoader();

function ResponseLoader() {

    this[mediaType.TEXT_HTML] = function() {
        var header = httpResponseHeader.createHTTPResponseHeader( mediaType.TEXT_HTML );
    	return fileResponse.createFileResponse( header, 'utf8');
    };

    this[mediaType.TEXT_CSS] = function( req, res, args ) {
        var header = httpResponseHeader.createHTTPResponseHeader( mediaType.TEXT_CSS );
        plainFileResponse( req, res, args, fileResponse.createFileResponse( header, 'utf8' ));
    };

    this[mediaType.TEXT_JAVASCRIPT] = function( req, res, args ) {
        var header = httpResponseHeader.createHTTPResponseHeader( mediaType.TEXT_JAVASCRIPT );
        plainFileResponse( req, res, args, fileResponse.createFileResponse( header, 'utf8' ));
    };

    this[mediaType.IMAGE_PNG] = function( req, res, args ) {
        var header = httpResponseHeader.createHTTPResponseHeader( mediaType.IMAGE_PNG );
        plainFileResponse( req, res, args, fileResponse.createFileResponse( header, 'binary' ));
    };

    this[mediaType.IMAGE_JPEG] = function( req, res, args ) {
        var header = httpResponseHeader.createHTTPResponseHeader( mediaType.TEXT_JPEG );
        plainFileResponse( req, res, args, fileResponse.createFileResponse( header, 'binary' ));
    };

    this[mediaType.IMAGE_JPG] = function( req, res, args ) {
        var header = httpResponseHeader.createHTTPResponseHeader( mediaType.TEXT_JPG );
        plainFileResponse( req, res, args, fileResponse.createFileResponse( header, 'binary' ));
    };

    this[mediaType.VIDEO_OGG] = function( req, res, args ) {
        var header = httpResponseHeader.createHTTPResponseHeader( mediaType.VIDEO_OGG );
        videoFileResponse( req, res, args, fileResponse.createFileResponse( header, 'binary' ));
    };

    this[mediaType.VIDEO_MP4] = function( req, res, args ) {
        var header = httpResponseHeader.createHTTPResponseHeader( mediaType.VIDEO_MP4 );
        videoFileResponse( req, res, args, fileResponse.createFileResponse( header, 'binary' ));
    };
    
    function plainFileResponse( req, res, args, responder ) {
        
        responder.onError( function( header, err ) {
            console.log(err);
            response.send404(res, header);
        } );
        
        responder.onContent( function( header, data, encoding ) {
            response.send200(res, header, data, encoding);
        } );
        
        responder.loadData(FILE_PATH + req.url);
    }
    
    function videoFileResponse( req, res, args, responder ) {
        
        responder.onError( function( header, err ) {
            console.log(err);
            response.send404(res, header);
        } );
        
        responder.onPartialContent( function( header, data, encoding ) {
            response.send206(res, header, data, encoding);
        } );
        
        responder.onContent( function( header, data, encoding ) {
            response.send200(res, header, data, encoding);
        } );
        
        responder.loadData(FILE_PATH + req.url, req.headers['range']);
    }
}