var Remarkable = require('remarkable');

var getImageDimensionsFrom = require('./htmlAmpParser.js');

var parse = function(mdString, callback) {
  var md = new Remarkable('full');
  htmlString = md.render(mdString);
  console.log('html created!: ', htmlString);
  getImageDimensionsFrom(htmlString, function(dimensions) {
    console.log('dims: ',dimensions);
    // callback(md.render(mdString).replace(/(<img)/g, '<amp-img'));
  });
};

module.exports = parse;
