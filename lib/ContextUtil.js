/**
 * [heisemedia] 2012
 */

var headerUtil = require('RESThttp').httpHeaderUtil;
var headerKeys = headerUtil.keys;

exports.prepare200 = function( context, data ) {
  setData( context, data );
  setContentLength( context );
};

exports.prepare201 = function( context, locationURI, data ) {
  setData( context, data );
  setContentLength( context );
  setLocation( locationURI );
};

exports.prepare206 = function( context, data ) {
  setData( context, data );
  setContentLength( context );
};

exports.prepare302 = function( context, locationURI, data ) {
  setData( context, data );
  setContentLength( context );
  setLocation( locationURI );
};

exports.prepare307 = function( context, locationURI, data ) {
  setData( context, data );
  setContentLength( context );
  setLocation( locationURI );
};

function setData( context, data ) {
  context.response.data = data ? data : "";
};

function setContentLength( context ) {
  if( context.response.data && context.response.data.length ) {
    context.response.headers[ headerKeys.CONTENT_LENGTH ] = context.response.data.length;
  }
};

function setLocation( locationURI ) {
  context.response.headers[ headerKeys.LOCATION ] = locationURI;
};
