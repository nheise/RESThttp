
var ResourceLocatorFinder = require('./ResourceLocatorFinder.js').ResourceLocatorFinder;
var InterceptHiddenRequestMethodInPOSTRequest = require('./InterceptHiddenRequestMethodInPOSTRequest.js').InterceptHiddenRequestMethodInPOSTRequest;
var ResourceLocatorSupportsRequestMethod = require('./ResourceLocatorSupportsRequestMethod.js').ResourceLocatorSupportsRequestMethod;
var FindAcceptedMediaType = require('./FindAcceptedMediaType.js').FindAcceptedMediaType;
var ResolveRequestArgsAndExecuteRequestHandler = require('./ResolveRequestArgsAndExecuteRequestHandler.js').ResolveRequestArgsAndExecuteRequestHandler;

exports.BasicRequestProcessorChain = BasicRequestProcessorChain;

function BasicRequestProcessorChain() {

  this.process = function( context ) {
    new ResourceLocatorFinder(
      new InterceptHiddenRequestMethodInPOSTRequest(
        new ResourceLocatorSupportsRequestMethod(
          new FindAcceptedMediaType(
            new ResolveRequestArgsAndExecuteRequestHandler()
          )
        )
      )
    ).process( context );
  }
}
