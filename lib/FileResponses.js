
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

  this.path = path;
  this.context = context;
  this.sendContentStrategy = sendContentStrategy;

  this.range = undefined;

  this.fileSize;
};
/*
  function nowPlusMillis( millis ) {
    return new Date( Date.parse( new Date() ) +  millis );
  }
*/
FileResponse.prototype.hasRange = function() {
  return !(typeof this.range === "undefined");
};

FileResponse.prototype.ifIsRangeRequestExtractRange = function() {
  var headers = this.context.request.headers;
  if( headerUtil.hasRange( headers ) ) {
    this.range =  headerUtil.extractRange( headers, this.fileSize );
  }
};

FileResponse.prototype.setHeader = function() {
  var headers = this.context.response.headers;
//  headers[headerKeys.CACHE_CONTROL] = 'max-age=21600'
//  header.setExpires( nowPlusMillis( 6 * 3600000 ).toGMTString() );
  headers[headerKeys.ACCEPT_RANGES] = 'bytes';
  headers[headerKeys.CONTENT_LENGTH] = this.fileSize;
};

FileResponse.prototype.setPartialHeader = function() {
  var headers = this.context.response.headers;
  headers[headerKeys.CACHE_CONTROL] = 'no-cache';
  headers[headerKeys.CONTENT_RANGE] = headerUtil.createContentRangeString( this.range, this.fileSize );
  headers[headerKeys.CONTENT_LENGTH] = headerUtil.calcContentLength( this.range, this.fileSize );
};

FileResponse.prototype.process = function() {
  var self = this;
  fs.stat( this.path, function ifAvailableSendContentOrSendError( err, stats ) {
    if( err ) {
      responseUtil.send404( self.context );
    }
    else {
      self.fileSize = stats.size;
      self.ifIsRangeRequestExtractRange();
      self.sendContentStrategy.call( self );
    }
  });
};

function streamFileContent() {
  var self = this;
  var readStream = fs.createReadStream( this.path, this.range );
  readStream.on( 'error', function (exception) { responseUtil.send500( this.context ); } );
  readStream.on( 'open', function (fd) { 
    self.setHeader();
    if( self.hasRange() ) {
      self.setPartialHeader();
      responseUtil.writeHead206( self.context );
    }
    else {
      responseUtil.writeHead200( self.context );
    }
  });
  readStream.pipe( this.context.responseStream );
};

function sendFileContent() {
  var self = this;
  if( self.hasRange() ) {
    fs.open( self.path, 'r', function( err, fd ) {
      if( err ) {
        responseUtil.send500( self.context );
      }
      else {
        var buffer = new Buffer( self.range.length );

        fs.read( fd, buffer, 0, self.range.length, self.range.start,
          function( err, bytesRead, buffer ) {
            if( err ) {
              responseUtil.send500( self.context );
            }
            else {
              self.setHeader();
              self.setPartialHeader();
              responseUtil.send206( self.context, buffer );
            }
         });
      }
    });
  }
  else {
    fs.readFile( self.path, function( err, data ) {
      if( err ) {
        responseUtil.send500( self.context );
      }
      else {
        self.setHeader();
        responseUtil.send200( self.context, data );
      }
    });
  } 
};
