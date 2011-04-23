/**
 * [heisemedia] 2011
 */

exports.createRepository = function() {
	return new ResourceRepository();
};

function ResourceRepository() {
	
	var resources = [];
	
	this.addResources = function(resources) {
		for(index in resources) {
			this.addResource(resources[index]);
		}
	};
	
	this.addResource = function(resource) {
		resources.push(resource);
	};

	this.findResourceForRequest = function(request) {
		for(index in resources) {
			var uriPattern = resources[index].uriPattern;
			if(uriPattern.match(request.url)) {
				return resources[index];
			}
		}
	};

}