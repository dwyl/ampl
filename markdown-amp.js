var Remarkable = require('remarkable');

var getImageDimensionsFrom = require('./htmlAmpParser.js');

var parse = function(mdString, callback) {
  var md = new Remarkable('full');
  htmlString = md.render(mdString);
  console.log('html created!: ', htmlString);
  getImageDimensionsFrom(htmlString, function(dimensions) {
    console.log('dims: ',dimensions);
    var i = 0;
    var re = /(<img)/;
    while(re.test(htmlString)) {
      var newTag =
        '<amp-img width=\"' + dimensions[i].width +
        '\" height=\"' + dimensions[i].height + '\"';
      htmlString = htmlString.replace(re, newTag);
      i += 1;
    }
    callback(htmlString);
  });
};

module.exports = parse;
