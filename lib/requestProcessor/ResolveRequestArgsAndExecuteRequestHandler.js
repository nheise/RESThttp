
var restHttp = require('RESThttp');
var headerKeys = restHttp.httpHeaderUtil.keys;

exports.ResolveRequestArgsAndExecuteRequestHandler = ResolveRequestArgsAndExecuteRequestHandler;

function ResolveRequestArgsAndExecuteRequestHandler() {

  this.process = function( context ) {
    context.request.args = context.resourceLocator.resolveRequestArgs( context.request.uri );
    
    context.resourceLocator.getRequestHandlerByMethodAndMediaType( context.request.method, context.response.headers[headerKeys.CONTENT_TYPE] )( context );
  }
}

