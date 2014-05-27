
var contextFactory = require('../ContextFactory.js');

exports.InitialRequestProcessor = InitialRequestProcessor;

function InitialRequestProcessor( requestProcessorChain, serverConfiguration ) {

  this.createContextAndStartProcess = function( requestListener, responseStream ) {

    var context = contextFactory.create( requestListener, responseStream, serverConfiguration );

    requestProcessorChain.process( context );
  }

}
