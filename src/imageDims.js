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
          next(sizeOf(body), index);
        });
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
  });
  response.on('end', function() {
    callback(Buffer.concat(chunks));
  });
};
