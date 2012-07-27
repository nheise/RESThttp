
exports.QuickSort = QuickSort;

function QuickSort( array, objectAttributeComparisonStrategy ) {

  var self = this;

  var getComparisonAttribute = objectAttributeComparisonStrategy || noObjectAttributeComparisonStrategy;

  function partition( begin, end, pivot ) {
    var piv = array[pivot];
    swap( pivot, end - 1 );
    var store = begin;
    var ix;
    for( ix = begin; ix < end - 1; ++ix ) {
      if( getComparisonAttribute( array[ix] ) <= getComparisonAttribute( piv ) ) {
        swap( store, ix );
        ++store;
       }
    }
    swap( end - 1, store );

    return store;
  }

  function qsort( begin, end ) {
    if( end - 1 > begin ) {
      var pivot = begin + Math.floor( Math.random() * ( end - begin ) );

      pivot = partition( begin, end, pivot );

      qsort( begin, pivot );
      qsort( pivot + 1, end );
    }
  }

  this.sortAsc = function() {
    qsort( 0, array.length );
    return array;
  }

  this.sortDesc = function() {
    return self.sortAsc().reverse();
  }

  function swap( a, b ) {
    var tmp = array[a];
    array[a] = array[b];
    array[b] = tmp;
  }

  function noObjectAttributeComparisonStrategy( object ) {
    return object;
  }
}
