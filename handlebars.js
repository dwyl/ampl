var fs = require('fs');
var Handlebars = require('handlebars');

function buildPost(postData, source) {
  var source = fs.readFileSync(__dirname + '/../views/layout/post.html');
  var template = Handlebars.compile(source.toString());
  var data = {
    "content": postData
  };

  return template(data);
}

function buildIndex(indexData){
  var source = fs.readFileSync(__dirname + '/../views/layout/index.html');
  var template = Handlebars.compile(source.toString());
  var data = {
    "post": indexData
  };
  return template(data);
}

module.exports = {
  buildPost: buildPost,
  buildIndex: buildIndex
};
