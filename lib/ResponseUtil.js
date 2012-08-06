/**
 * [heisemedia] 2012
 */

var headerKeys = require('./HTTPHeaderUtil.js').keys;

exports.send200 = function( context, data ) {
  send( 200, 'OK', context, data );
};

exports.writeHead200 = function( context ) {
  writeHead( 200, 'OK', context );
};

exports.send206 = function( context, data ) {
  send( 206, 'Partial Content', context, data );
};

exports.writeHead206 = function( context ) {
  writeHead( 206, 'Partial Content', context );
};

exports.send404 = function( context ) {
  console.log( "Have 404 !!!" );
  sendOnlyHeader( 404, 'Not Found', context  );
};

exports.send405 = function( context ) {
  console.log( "Have 405 !!!" );
  sendOnlyHeader( 405, 'Method Not Allowed.', context );
};

exports.send406 = function( context ) {
  console.log( "Have 406 !!!" );
  sendOnlyHeader( 406, 'Not Acceptable.', context );
};

exports.send415 = function( context ) {
  console.log( "Have 415 !!!" );
  sendOnlyHeader( 415, 'Unsupported Media Type.', context );
};

exports.send500 = function( context ) {
  console.log( "Have 500 !!!" );
  sendOnlyHeader( 500, 'Internal Server Error.', context );
};

function writeHead( httpStatusCode, reasonPhrase, context )  {
   context.responseStream.writeHead( httpStatusCode, reasonPhrase, context.response.headers );
}

function send( httpStatusCode, reasonPhrase, context, data ) {
  /*
   * console.log(request.url); console.log(request.contexts);
   * console.log(self.context.getFields());
   */
  setHeaderContentLength( context, data );
  writeHead( httpStatusCode, reasonPhrase, context );
  context.responseStream.end( data ? data : "", context.response.encoding );
}

function sendOnlyHeader( httpStatusCode, reasonPhrase, context ) {
  writeHead( httpStatusCode, reasonPhrase, context );
  context.responseStream.end();
}

function setHeaderContentLength( context, data ) {
  if( data ) {
    context.response.headers[headerKeys.CONTENT_LENGTH] = data.length;
  }
  else {
    context.response.headers[headerKeys.CONTENT_LENGTH] = 0;
  }
}
