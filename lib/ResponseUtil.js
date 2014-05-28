/**
 * [heisemedia] 2012
 */

exports.send200 = function( context ) {
  send( 200, 'OK', context );
};

exports.writeHead200 = function( context ) {
  writeHead( 200, 'OK', context );
};

exports.send201 = function( context ) {
  send( 201, 'Created', context );
};

exports.send206 = function( context ) {
  send( 206, 'Partial Content', context );
};

exports.writeHead206 = function( context ) {
  writeHead( 206, 'Partial Content', context );
};

exports.send302 = function( context ) {
  console.log( "Have 302 !!!" );
  send( 302, 'Found', context  );
};

exports.send303 = function( context ) {
  console.log( "Have 303 !!!" );
  send( 303, 'See Other', context  );
};

exports.send307 = function( context ) {
  console.log( "Have 307 !!!" );
  send( 307, 'Temporary Redirect', context  );
};

exports.send400 = function( context ) {
  console.log( "Have 400 !!!" );
  send( 400, 'Bad Request', context );
};

exports.send404 = function( context ) {
  console.log( context );
  console.log( "Have 404 !!!" );
  send( 404, 'Not Found', context  );
};

exports.send405 = function( context ) {
  console.log( "Have 405 !!!" );
  send( 405, 'Method Not Allowed.', context );
};

exports.send406 = function( context ) {
  console.log( "Have 406 !!!" );
  send( 406, 'Not Acceptable.', context );
};

exports.send409 = function( context ) {
  console.log( "Have 409 !!!" );
  send( 409, 'Conflict', context );
};

exports.send415 = function( context ) {
  console.log( "Have 415 !!!" );
  send( 415, 'Unsupported Media Type.', context );
};

exports.send500 = function( context ) {
  console.log( "Have 500 !!!" );
  send( 500, 'Internal Server Error.', context );
};

function writeHead( httpStatusCode, reasonPhrase, context )  {
   context.responseStream.writeHead( httpStatusCode, reasonPhrase, context.response.headers );
}

function send( httpStatusCode, reasonPhrase, context ) {
  writeHead( httpStatusCode, reasonPhrase, context );
  context.responseStream.end( context.response.data, context.response.encoding );
}
