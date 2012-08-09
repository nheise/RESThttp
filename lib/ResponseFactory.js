/**
 * [heisemedia] 2012
 */

exports.create = function() {
  return new Response();
};

function Response() {
    
  this.headers = {
    'content-length' : 0
  };
  
  this.encoding = 'utf8';

  this.data = "";
}


