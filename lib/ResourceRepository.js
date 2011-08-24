/**
 * [heisemedia] 2011
 */

var fs = require( 'fs' );

var configuration = require('../Configuration.js');

var uriPatternFactory = require("./URIPattern.js");

var componentsPath = configuration.RESOURCE_PATH;

var repository;

exports.repository = repository;

;(function() {
    repository = new ResourceRepository();
	
    fs.readdir( componentsPath , function( err, files ) {
		
		if( err ) {
			throw err;
		}
		
		for( var index in files ) {
			console.log( '.' + componentsPath + '/' + files[index] );
			repository.addResources( require( '.' + componentsPath + '/' + files[index] + '/resources.js' ).resources,
			                         '.' + componentsPath + '/' + files[index] );
		}
	});
	
	return repository;
})();

function ResourceRepository() {

    var resources = [];

    this.addResources = function( resources, componentPath ) {
        for( index in resources) {
            this.addResource( resources[index], componentPath );
        }
    };

    this.addResource = function( resource, componentPath ) {
        resources.push( {
            'uriPattern' : uriPatternFactory.create( resource.path ),
            'resource' : resource 
        } );
        console.log( "add " + resource.path );
    };

    this.findResourceForURI = function( uri ) {
        for( index in resources) {
            var uriPattern = resources[index].uriPattern;
            if( uriPattern.match( uri ) ) {
                return resources[index].resource;
            }
        }
    };

}