/**
 * 
 */

exports.create = function( path ) {
  return new URIPattern( path );
};

function URIPattern( path ) {

  var pattern = new RegExp( '^' + path.replace( /{[\w\.]+}/g, '([ \\wäöüÄÜÖ\\.\/-]+)' ) + '/?$' );

  var pathVars = extractPathVarsAsArray();

  this.match = function( uri ) {
    return pattern.test( uri );
  };

  this.resolveArgs = function( uri ) {
    var vars = {};
    var hit = pattern.exec( uri );
    for ( index in pathVars ) {
      vars[ pathVars[ index ] ] = hit[ parseInt( index ) + 1 ];
    }
    return vars;
  };

  function extractPathVarsAsArray() {
    var regx = /{([\w\.]+)}/g;
    var vars = [];
    while ( ( hit = regx.exec( path ) ) != null ) {
      vars.push( hit[ 1 ] );
    }
    return vars;
  }
}
