
var util = require('util');
var events = require('events');

var fs = require('fs');

exports.createFileReader = function() {
    return new FileReader();
};

function FileReader() {
	
	var self = this;

	var ERROR_EVENT = "error";
	var DATA_EVENT = "data";
	var CLOSE_EVENT = "close";
    
    this.readFromPositionToPosition = function(filePath, beginPosition, endPosition) {
        
        fs.stat(filePath, function(err, stats){
            if (err) {
                self.emit(ERROR_EVENT, err);
                return;
            }
            
            var contentOffset = beginPosition ? beginPosition : 0;
            
            var contentLength = endPosition ? endPosition + 1 - contentOffset : stats.size - contentOffset;
            
            fs.open(filePath, 'r', function(err, fd){
                if (err) {
                	self.emit(ERROR_EVENT, err);
                    return;
                }
                
                var buffer = new Buffer(contentLength);
                
                fs.read(fd, buffer, 0, contentLength, contentOffset, function(err, bytesRead){
                    if (err) {
                    	self.emit(ERROR_EVENT, err);
                        return;
                    }
                    
                    self.emit(DATA_EVENT, buffer, bytesRead, stats.size);
                    
                    fs.close(fd, function(){
                    	self.emit(CLOSE_EVENT);
                    });
                });
                
                
            }); 
        });
    };
    
    this.read = function(filePath) {
        
        fs.stat(filePath, function(err, stats) {
            if(err) {
            	self.emit(ERROR_EVENT, err);
                return;
            }
            else {
                fs.readFile(filePath, function (err, data) {
                    if(err) {
                    	self.emit(ERROR_EVENT, err);
                        return;
                    }
                    
                    self.emit(DATA_EVENT, data, stats.size);
                    
                    self.emit(CLOSE_EVENT);
                });
            }
		});
    };
    
    this.onError = function(callback) {
    	this.addListener(ERROR_EVENT, callback);
    };
    
    this.onData = function(callback) {
    	this.addListener(DATA_EVENT, callback);
    };
    
    this.onClose = function(callback) {
    	this.addListener(CLOSE_EVENT, callback);
    };
}

util.inherits(FileReader, events.EventEmitter);
