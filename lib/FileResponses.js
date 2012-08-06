
var fs = require( 'fs' );
var util = require("util");

var headerUtil = require('./HTTPHeaderUtil.js');
var headerKeys = headerUtil.keys;
var responseUtil = require('./ResponseUtil.js');

exports.createStreamFileResponse = function( pathExtractionStrategie, encoding ) {
  return function( context ) {
    if( encoding ) context.response.encoding = encoding;
    new FileResponse( pathExtractionStrategie( context ), context, streamFileContent ).process();
  };
}

exports.createBufferedFileResponse = function( pathExtractionStrategie, encoding ) {
  return function( context ) {
    if( encoding ) context.response.encoding = encoding;
    new FileResponse( pathExtractionStrategie( context ), context, sendFileContent ).process();
  };
}

function FileResponse( path, context, sendContentStrategy ) {

  var self = this;

  var range = undefined;
  ifIsRangeRequestExtractRange();

  var fileSize;

  function nowPlusMillis( millis ) {
    return new Date( Date.parse( new Date() ) +  millis );
  }

  this.hasRange = function () {
    return range != undefined;
  }

  function ifIsRangeRequestExtractRange() {
    var headers = context.request.headers;
    if( headerUtil.hasRange( headers ) ) {
      range =  headerUtil.extractRange( headers );
    }
  }

  this.setHeader = function() {
    var headers = context.response.headers;
//  header.setCacheControl( 'max-age=21600' );
//  header.setExpires( nowPlusMillis( 6 * 3600000 ).toGMTString() );
    headers[headerKeys.ACCEPT_RANGES] = 'bytes';
    headers[headerKeys.CONTENT_LENGTH] = fileSize;
  }

  this.setPartialHeader = function() {
    var headers = context.response.headers;
    headers[headerKeys.CONTENT_RANGE] = headerUtil.createContentRangeString( range, fileSize );
    headers[headerKeys.CONTENT_LENGTH] = headerUtil.calcContentLength( range, fileSize );
  }

  function ifAvailableSendContentOrSendError( err, stats ) {
    if( err ) {
      responseUtil.send404( context );
    }
    else {
      fileSize = stats.size;
      sendContentStrategy.call( self, path, range, context );
    }
  }

  this.process = function() {
    fs.stat( path, ifAvailableSendContentOrSendError );
  };
}

function streamFileContent( path, range, context ) {
  var self = this;
  var readStream = fs.createReadStream( path, range );
  readStream.on( 'error', function (exception) { responseUtil.send500( context ); } );
  readStream.on( 'open', function (fd) { 
    self.setHeader();
    if( self.hasRange() ) {
      self.setPartialHeader();
      responseUtil.writeHead206( context );
    }
    else {
      responseUtil.writeHead200( context );
    }
  });
  readStream.pipe( context.responseStream );
}

function sendFileContent( path, range, context ) {
  var self = this;
  if( self.hasRange() ) {
    self.setPartialHeader();
    fs.open( path, 'r', function( err, fd ) {
      if( err ) {
        responseUtil.send500( context );
      }
      else {

        responseUtil.writeHead206( context );

        var buffer = new Buffer( range.length );

        fs.read( fd, buffer, 0, range.length, range.offset,
          function( err, bytesRead, buffer ) {
            if( err ) {
              responseUtil.send500( context );
            }
            else {
              responseUtil.send206( context, buffer );

              fs.close( fd, function() {
                context.responseStream.end();
              });
            }
         });
      }
    });
  }
  else {
    fs.readFile( filePath, function( err, data ) {
      if( err ) {
        responseUtil.send500( context );
      }
      else {
        responseUtil.send200( context, data );
      }
    });
  } 
}
