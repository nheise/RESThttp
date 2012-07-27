
var uriPatternFactory = require("./URIPattern.js");

var modules = [];

exports.put = function( definition ) {
  modules.push( new Module( definition ) );
}

exports.findResourceLocatorForURI = function( uri ) {

  for( index in modules ) {
    var resourceLocator = modules[index].getResourceLocatorForUri( uri );

    if( resourceLocator != undefined ) {
      return resourceLocator;
    }
  }
}

function Module( definition ) {

  this.id = definition.id;

  var resourceLocators = createResourceLocators( definition.resourceLocators );
  
  this.getResourceLocatorForUri = function( uri ) {

    for( index in definition.resourceLocators ) {

      var resourceLocator = resourceLocators[index];

      if( resourceLocator.matchURIToLocatorPattern( uri ) ) {
        return resourceLocator;
      }
    }
  }

  function createResourceLocators( definitions ) {
    var resourceLocators = [];

    for( index in definitions ) {
      resourceLocators.push( new ResourceLocator( definitions[index] ) );
    }

    return resourceLocators;
  }
}

function ResourceLocator( definition ) {

  var self = this;

  var uriPattern = uriPatternFactory.create( definition.uriPattern );

  this.matchURIToLocatorPattern = uriPattern.match;
    
  this.resolveRequestArgs = uriPattern.resolveArgs;

  this.supportRequestMethod = function( requestMethod ) {
    return definition.methods[requestMethod] ? true : false;
  }

  this.isMediaTypeSupportedForMethod = function( mediaType, requestMethod ) {
    return self.supportRequestMethod( requestMethod ) && definition.methods[requestMethod][mediaType] ? true : false;
  }

  this.getRequestHandlerByMethodAndMediaType = function( requestMethod, mediaType ) {
    return definition.methods[requestMethod][mediaType];
  }
} 
