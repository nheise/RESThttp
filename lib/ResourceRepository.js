/**
 * [heisemedia] 2011
 */

exports.createRepository = function() {
    return new ResourceRepository();
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