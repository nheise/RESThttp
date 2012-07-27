/**
 * [heisemedia] 2011
 */

const ACCEPT_TYPE_PATTERN = /^.+\/.+$/;
const Q_PARAMETER_PATTERN = /^q=[0-9\.]{1,3}$/;

var urlParser = require('url');

var QuickSort = require('./util/ArrayUtil.js').QuickSort;

exports.create = function( requestListener ) {
  return new Request( requestListener );
};

function Request( requestListener ) {
    
  this.method = requestListener.method;
    
  this.headers = requestListener.headers;
    
  this.urlInfos = urlParser.parse( requestListener.url );
    
  this.uri = this.urlInfos.pathname;
    
  this.args;
    
  this.accept = extractAcceptFromRequest();
    
  function extractAcceptFromRequest() {

    var acceptStrChunks = chunkAcceptensString( removeWhiteSpaces( requestListener.headers.accept ) );

    var acceptArray = new Array();

    for( var i in acceptStrChunks ) {
      acceptArray.push( createAccept( acceptStrChunks[i] ) );
    }
        
    return new QuickSort( acceptArray, function( accept ) { return accept.q; } ).sortDesc();
  }

  function createAccept( acceptStr ) {
    var acceptChunks = acceptStr.split( ";" );

    var accept = {};

    for( var i in acceptChunks ) {
      if( isAcceptTypeChunk( acceptChunks[i] ) ) {
        accept.type = acceptChunks[i];
      }
      if( isQParameterChunk( acceptChunks[i] ) ) {
        accept.q = parseFloat( acceptChunks[i].replace( /q=/, "" ) );
      }
    }

    if( accept.q == undefined ) {
      accept.q = 1;
    }

    return accept;
  }

  function isAcceptTypeChunk( chunk ) {
    return ACCEPT_TYPE_PATTERN.test( chunk );
  }

  function isQParameterChunk( chunk ) {
    return Q_PARAMETER_PATTERN.test( chunk );
  }

  function removeWhiteSpaces( str ) {
    return str.replace( / /g, "" );
  }

  function chunkAcceptensString( str )  {
    return str.split( "," );
  }
}

