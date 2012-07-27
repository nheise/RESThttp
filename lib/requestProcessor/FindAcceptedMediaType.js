
var restHttp = require('RESThttp');
var responseUtil = restHttp.responseUtil;
var headerKeys = restHttp.httpHeaderUtil.keys;

exports.FindAcceptedMediaType = FindAcceptedMediaType;

function FindAcceptedMediaType( successor ) {

  this.process = function( context ) {

    var accept = findAcceptedMediaType( context );

    if( accept ) {
      context.response.headers[headerKeys.CONTENT_TYPE] = accept.type;
      successor.process( context );
    }
    else {
      responseUtil.send406( context );
    }
  }

  function findAcceptedMediaType( context ) {
    var accept = context.request.accept;

    for( i in accept ) {

      if( context.resourceLocator.isMediaTypeSupportedForMethod( accept[i].type, context.request.method ) ) {
        return accept[i];
      }
    }
  }
}
