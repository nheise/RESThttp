
var mediaType = require('./MediaType.js');
var fileResponse = require('./FileResponse.js');

var httpResponseHeader = require( './HTTPResponseHeader.js' );

var RESOURCE_PATH = require('../Configuration.js').RESOURCE_PATH;

exports.responseLoader = new ResponseLoader();

function ResponseLoader() {

    this[mediaType.TEXT_HTML] = function( header ) {
        header.setContentType( mediaType.TEXT_HTML );
    	return fileResponse.createFileResponse( header, 'utf8');
    };

    this[mediaType.TEXT_CSS] = function( req, res ) {
        res.header.setContentType( mediaType.TEXT_CSS );
        plainFileResponse( req, res, fileResponse.createFileResponse( res.header, 'utf8' ) );
    };

    this[mediaType.TEXT_JAVASCRIPT] = function( req, res ) {
        res.header.setContentType( mediaType.TEXT_JAVASCRIPT );
        plainFileResponse( req, res, fileResponse.createFileResponse( res.header, 'utf8' ));
    };

    this[mediaType.IMAGE_PNG] = function( req, res ) {
        res.header.setContentType( mediaType.IMAGE_PNG );
        plainFileResponse( req, res, fileResponse.createFileResponse( res.header, 'binary' ) );
    };

    this[mediaType.IMAGE_JPEG] = function( req, res ) {
        res.header.setContentType( mediaType.TEXT_JPEG );
        plainFileResponse( req, res, fileResponse.createFileResponse( res.header, 'binary' ) );
    };

    this[mediaType.IMAGE_JPG] = function( req, res ) {
        res.header.setContentType( mediaType.TEXT_JPG );
        plainFileResponse( req, res, fileResponse.createFileResponse( res.header, 'binary' ) );
    };

    this[mediaType.VIDEO_OGG] = function( req, res ) {
        res.header.setContentType( mediaType.VIDEO_OGG );
        videoFileResponse( req, res, fileResponse.createFileResponse( res.header, 'binary' ) );
    };

    this[mediaType.VIDEO_MP4] = function( req, res ) {
        res.header.setContentType( mediaType.VIDEO_MP4 );
        videoFileResponse( req, res, fileResponse.createFileResponse( res.header, 'binary' ) );
    };
    

    function plainFileResponse( req, res, responder ) {

        responder.onError( function( err ) {
            console.log( err );
            res.send404();
        } );

        responder.onContent( function( data, encoding ) {
            res.send200( data, encoding );
        } );

        responder.loadData( RESOURCE_PATH + req.uri );
    }
    

    function videoFileResponse( req, res, responder ) {

        responder.onError( function( err ) {
            console.log( err );
            res.send404();
        } );

        responder.onPartialContent( function( data, encoding ) {
            res.send206( data, encoding );
        } );

        responder.onContent( function( data, encoding ) {
            res.send200( data, encoding );
        } );

        responder.loadData( RESOURCE_PATH + req.uri, req.headers['range'] );
    }
}