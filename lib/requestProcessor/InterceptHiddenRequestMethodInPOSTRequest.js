
var queryString = require('querystring');

var restHttp = require('RESThttp');
var responseUtil = restHttp.responseUtil;
var headerKeys = restHttp.httpHeaderUtil.keys;

exports.InterceptHiddenRequestMethodInPOSTRequest = InterceptHiddenRequestMethodInPOSTRequest;

function InterceptHiddenRequestMethodInPOSTRequest( successor ) {
  this.successor = successor;
}

InterceptHiddenRequestMethodInPOSTRequest.prototype.process = function( context ) {

  if( this.hasPOSTMethod( context ) && this.isContentTypexWWWFormUrlencoded( context ) ) {
    this.getDataThenChangeMethodToPUTAndRemoveHiddenFieldThenContinueProcessing( context );
  }
  else {
    this.successor.process( context );
  }
}

InterceptHiddenRequestMethodInPOSTRequest.prototype.hasPOSTMethod = function( context ) {
  return context.request.method == 'POST';
}

InterceptHiddenRequestMethodInPOSTRequest.prototype.isContentTypexWWWFormUrlencoded = function( context ) {
  return context.request.headers[ headerKeys.CONTENT_TYPE ] == 'application/x-www-form-urlencoded';
}

InterceptHiddenRequestMethodInPOSTRequest.prototype.getDataThenChangeMethodToPUTAndRemoveHiddenFieldThenContinueProcessing = function( context ) {
  var self = this;
  var data = "";

  context.requestListener.on( 'data', function( chunk ) {
    data = data + chunk;
  });

  context.requestListener.on( 'end', function() {
    data = self.parsePOSTQueryStringIntoJSON( data );
    if( self.ifHiddenFieldInPOSTData( data ) ) {
      self.replaceRequestMethodWithHiddenFieldType( context, data );
      self.removeHiddenFieldFromPOSTData( data );
    }
    context.request.data = data;
    self.successor.process( context );
  });
}

InterceptHiddenRequestMethodInPOSTRequest.prototype.parsePOSTQueryStringIntoJSON = function( data ) {
  return queryString.parse( data );
}

InterceptHiddenRequestMethodInPOSTRequest.prototype.ifHiddenFieldInPOSTData = function( data ) {
  return data._method;
}

InterceptHiddenRequestMethodInPOSTRequest.prototype.replaceRequestMethodWithHiddenFieldType = function( context, data ) {
  context.request.method = data._method;
}

InterceptHiddenRequestMethodInPOSTRequest.prototype.removeHiddenFieldFromPOSTData = function( data ) {
  delete data['_method'];
}
