var assert = require('assert');
var htmlparser = require("htmlparser2");
var sizeOf = require('image-size');
var http = require('http');
var url = require('url');

var fs = require('fs');

var getImageUrls = function(html, callback) {
  var urls = [];
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs) {
      if (name === 'img') {
        urls.push(attribs.src);
      }
    },
    onend: function() {
      callback(urls);
    }
  });
  parser.write(html);
  parser.end();
};

var getImageSizes = function(html, callback) {
  getImageUrls(html, function(imageUrls) {
    var totalLinks = imageUrls.length;
    if (totalLinks === 0) {
      callback([]);
    } else {
      // console.log(totalLinks, imageUrls);
      var dimsFetched = 0;
      var dimsArray = [];
      // console.log('number of images: ', imageUrls.length);
      imageUrls.forEach(function(imageUrl, index) {
        var options = url.parse(imageUrl);
        if (options.protocol === 'https:') options.protocol = 'http:';
        console.log("making request!!");
        var request = http.request(options, function(response) {
          console.log("request succesful");
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
  });
}

var getBody = function(response, callback) {
  var chunks = [];
  response.on('data', function(chunk) {
    chunks.push(chunk);
  });
  response.on('end', function() {
    callback(Buffer.concat(chunks));
  });
}

module.exports = getImageSizes;
