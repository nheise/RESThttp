
var modules = require('../ModuleRepository.js');
var responseUtil = require('RESThttp').responseUtil;

exports.ResourceLocatorFinder = ResourceLocatorFinder;

function ResourceLocatorFinder( successor ) {

  this.process = function( context ) {
    var resourceLocator = modules.findResourceLocatorForURI( context.request.uri );

    if( resourceLocator ) {
      context.resourceLocator = resourceLocator;
      successor.process( context );
    }
    else {
      responseUtil.send404( context );
    }
  }
}
