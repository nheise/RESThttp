
var HEADER_RANGE_FIELD_REGEXP = new RegExp( '^bytes=(\\d.*)?-(\\d.*)?' );

exports.extractRange = function( requestHeader, size ) {
    var hits = requestHeader['range'].match( HEADER_RANGE_FIELD_REGEXP );
    
    var start = hits[1] ? parseInt( hits[1] ) : 0;
    var end = hits[2] ? parseInt( hits[2] ) : size;
    
    return {
        start : start,
        end : end
    };
};

exports.createContentRangeString = function( range, size ) {
   return 'bytes ' + range.start + '-' + range.end + '/' + size;
};