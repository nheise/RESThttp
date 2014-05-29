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
  setLocation( context, locationURI );
};

exports.prepare206 = function( context, data ) {
  setData( context, data );
  setContentLength( context );
};

exports.prepare302 = function( context, locationURI, data ) {
  setData( context, data );
  setContentLength( context );
  setLocation( context, locationURI );
};

exports.prepare303 = function( context, locationURI, data ) {
  setData( context, data );
  setContentLength( context );
  setLocation( context, locationURI );
};

exports.prepare307 = function( context, locationURI, data ) {
  setData( context, data );
  setContentLength( context );
  setLocation( context, locationURI );
};

function setData( context, data ) {
  context.response.data = data || "";
};

function setContentLength( context ) {
  if( context.response.data && context.response.data.length ) {
    context.response.headers[ headerKeys.CONTENT_LENGTH ] = Buffer.byteLength( context.response.data, context.response.encoding );
  }
};

function setLocation( context, locationURI ) {
  context.response.headers[ headerKeys.LOCATION ] = locationURI;
};
