var assert = require('assert');
var sizeOf = require('image-size');
var http = require('http');
var https = require('https');
var url = require('url');

export var getDims = (imageUrls, callback) => {
  var totalLinks = imageUrls.length;
  if (totalLinks === 0) {
    setTimeout(function() {
      callback([]);
    }, 0);
  } else {
    var dimsFetched = 0;
    var dimsArray = [];
    imageUrls.forEach(function(imageUrl, index) {
      var options = url.parse(imageUrl);
      var proto = options.protocol === 'https:' ? https : http;
      // if (options.protocol === 'https:') options.protocol = 'http:';
      var request = proto.request(options, function(response) {
        getBody(response, function(body) {
          var dims;
          try {
            dims = sizeOf(body);
            // if (typeof dims.width === 'undefined') throw 'NO';
          } catch(e) {
            dims = {
              width: 0,
              height: 0
            }
            console.warn('failed to find size of image', imageUrl);
          }
          next(dims, index);
        });
      });
      request.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
        next({
          width: 0,
          height: 0
        }, index);
      });
      request.end();
    });
  }
  var next = function(dims, index) {
    dimsFetched += 1;
    dimsArray[index] = dims;
    if (dimsFetched === totalLinks) {
      callback(dimsArray);
    }
  }
}

var getBody = function(response, callback) {
  var chunks = [];
  response.on('data', function(chunk) {
    chunks.push(chunk);
    if (chunks.length === 2) {
      callback(Buffer.concat(chunks));
    }
  });
  response.on('end', function() {
    if (chunks.length < 2) {
      callback(Buffer.concat(chunks));
    }
  });
};
