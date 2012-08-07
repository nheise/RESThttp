var format = require('util').format;

exports.keys = {
  SERVER : 'server',
  'DATE' : 'date',

  CONTENT_TYPE : 'content-type',
  CONTENT_LENGTH : 'content-length',
  CONTENT_RANGE : 'content-range',
  ACCEPT_RANGES : 'accept-ranges',

  CACHE_CONTROL : 'cache-control',
  LAST_MODIFIED : 'last-modified',
  EXPIRES : 'expires',
  ETAG : 'etag'
}

const CONTENT_RANGE_FORMAT = 'bytes %d-%d/%d';

exports.createContentRangeString  = function( range, size ) {
  return format( CONTENT_RANGE_FORMAT, range.start, range.end ? range.end : size - 1, size );
}

const HEADER_RANGE_FIELD_REGEXP = new RegExp( '^bytes=(\\d.*)?-(\\d.*)?' );

exports.extractRange = function( headers, size ) {
  var hits = headers['range'].match( HEADER_RANGE_FIELD_REGEXP );
  
  var start = hits[1] ? parseInt( hits[1] ) : 0;
  var end = hits[2] ? parseInt( hits[2] ) : size ? size - 1 : undefined;
  var length = end ? end - start + 1 : size ? size - start : undefined;

  return {
    start : start,
    end : end,
    length : length
  };
}

exports.hasRange = function( headers ) {
  return headers['range'] ? true : false;
}

exports.calcContentLength = function( range, size ) {
  return range.length ? range.length : size - range.start; 
}
