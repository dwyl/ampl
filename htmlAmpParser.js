var assert = require('assert');
var htmlparser = require("htmlparser2");
var sizeOf = require('image-size');
// var Buffer = require('buffer');
var http = require('http');
var url = require('url');

// var HtmlParser = require('htmlparser2');
// var DomUtils = require('domutils');
var fs = require('fs');
var rawHtml = fs.readFileSync(__dirname + '/../posts/post-1.html').toString();
// console.log(rawHtml);
var getImageUrls = function(html, callback) {
  var urls = [];
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs) {
      // console.log(name);
      if (name === 'img') {
        // console.log(attribs.src);
        urls.push(attribs.src);
        // console.log('found an image!!!');
      }
    },
    onend: function() {
      // console.log('parser is done!');
      callback(urls);
    }
  });
  // var parser = new htmlparser.Parser(handler);
  parser.write(html);
  parser.end();
}

var getImageSizes = function(html, callback) {
  getImageUrls(html, function(imageUrls) {
    // console.log('imageUlrs: ', imageUrls);
    var totalLinks = imageUrls.length;
    var dimsFetched = 0;
    var dimsArray = [];
    imageUrls.forEach(function(imageUrl, index) {
      // console.log('got imageurls. On ', imageUrl)
      // console.log('options: ', url.parse(imageUrl));
      var request = http.request(url.parse(imageUrl), function(response) {
        var chunks = [];
        response.on('data', function(chunk) {
          chunks.push(chunk);
        });
        response.on('end', function() {
          next(sizeOf(Buffer.concat(chunks)), index);
        })
      });
      request.end();
    });
    var next = function(dims, index) {
      dimsFetched += 1;
      dimsArray[index] = dims;
      if (dimsFetched === totalLinks) {
        callback(dimsArray);
      }
    }
  });
}

getImageSizes(rawHtml, function(dims) {
  console.log(dims);
})

//
//
// console.log(Object.keys(DomUtils));
//
// var testHtmlString =
//
// var imageToAmpImage = function(dom) {
//   var imageElements = DomUtils.getElementsByTagName('img', dom);
//   imageElements.forEach(function(imageElement, index) {
//     console.log('image number ', index, imageElement.attribs);
//     imageElement.type = 'amp-img';
//   });
//   // console.log('final dom', dom[2].children[3]);
//   console.log(dom.map(function(elem) {
//     return DomUtils.getInnerHTML(elem);
//   }).join());
//   // console.log(DomUtils.getText(dom));
// }
//
// var domHandler = new HtmlParser.DomHandler(function(err, dom) {
//   assert(!err, 'ERROR: failed to parse html!');
//   imageToAmpImage(dom)
// });
//
// var parser = new HtmlParser.Parser(domHandler);
// parser.write(testHtmlString);
// parser.done();
