var fs = require('fs');
var Handlebars = require('handlebars');
var source = fs.readFileSync('../views/layout/default.html');

function buildPost(postData) {
  var template = Handlebars.compile(source.toString());
  var data = {
    "content": postData
  };

  return template(data);
}
console.log(buildPost("hello you"))

module.exports = {
  buildPost: buildPost
}
