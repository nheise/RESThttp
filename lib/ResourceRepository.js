/**
 * [heisemedia] 2011
 */

var fs = require('fs');

exports.createRepository = function( path ) {
	var repository = new ResourceRepository();
	
	fs.readdir( path, function( err, files ) {
		
		if( err ) {
			throw err;
		}
		
		for( var index in files ) {
			console.log( path + '/' + files[index] );
			repository.addResources( require( '.' + path + '/' + files[index] + '/resources.js' ).resources );
		}
	});
	
	return repository;
};

function ResourceRepository() {

    var resources = [];

    this.addResources = function( resources ) {
        for( index in resources) {
            this.addResource( resources[index] );
        }
    };

    this.addResource = function( resource ) {
        resources.push( resource );
        console.log( "add " + resource.path );
    };

    this.findResourceForURI = function( uri ) {
        for( index in resources) {
            var uriPattern = resources[index].uriPattern;
            if( uriPattern.match( uri ) ) {
                return resources[index];
            }
        }
    };

}