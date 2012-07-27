
var responseUtil = require('../ResponseUtil.js');

exports.ResourceLocatorSupportsRequestMethod = ResourceLocatorSupportsRequestMethod;

function ResourceLocatorSupportsRequestMethod( successor ) {

  this.process = function( context ) {

    if( resourceLocatorSupportsRequestMethod( context ) ) {
      successor.process( context );
    }
    else {
      responseUtil.send405( context );
    }
  }

  function resourceLocatorSupportsRequestMethod( context ) {
    return context.resourceLocator.supportRequestMethod( context.request.method );
  }
}
