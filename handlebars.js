var fs = require('fs');
var Handlebars = require('handlebars');
var source = fs.readFileSync('../views/layout/default.html');

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function buildPost(postData) {
  var template = Handlebars.compile(ab2str(source));
  var data = {
    "content": postData
  };

  return template(data);
}

module.exports = {
  buildPost: buildPost
}
