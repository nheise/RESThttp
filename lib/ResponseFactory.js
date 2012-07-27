/**
 * [heisemedia] 2012
 */

exports.create = function() {
  return new Response();
};

function Response() {
    
  this.headers = {};
  
  this.encoding = 'utf8';  
}


