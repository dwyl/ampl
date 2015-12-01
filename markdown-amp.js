var Remarkable = require('remarkable');
// var fs         = require('fs');
// var post1      = fs.readFileSync(__dirname + '/../posts/post1.md');


// console.log(md.render(post1.toString()));

var md = new Remarkable('full');
module.exports = function parse(mdString) {
  return md.render(mdString).replace(/(<img)/g, '<amp-img');
};
