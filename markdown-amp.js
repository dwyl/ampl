var Remarkable = require('remarkable');

var getImageDimensionsFrom = require('./htmlAmpParser.js');

var parse = function(mdString, callback) {
  var md = new Remarkable('full');
  var htmlString = md.render(mdString);
  // console.log('html created!: ', htmlString);
  getImageDimensionsFrom(htmlString, function(dimensions) {
    // console.log('dims: ',dimensions);
    var i = 0;
    var imageTagRegex = /(<img)/;
    while(imageTagRegex.test(htmlString)) {
      var newTag =
        '<amp-img width=\"' + dimensions[i].width +
        '\" height=\"' + dimensions[i].height + '\"';
      htmlString = htmlString.replace(imageTagRegex, newTag);
      i += 1;
    }
    callback(htmlString);
  });
};

module.exports = parse;
