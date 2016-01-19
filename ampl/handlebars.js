var fs = require('fs');
var Handlebars = require('handlebars');

function registerPartials(){
  var partials = fs.readdirSync(__dirname + '/../views/partials');
  partials.forEach(function(partial){
    var partialName = partial.split('.')[0];
    Handlebars.registerPartial(partialName,fs.readFileSync(__dirname + '/../views/partials/' + partial).toString());
  });
  // console.log(partials);
}

function buildPost(postData, style) {
  var source = fs.readFileSync(__dirname + '/../views/layout/post.html');
  var template = Handlebars.compile(source.toString());
  var data = {
    content: postData,
    style: style
  };

  return template(data);
}

function buildIndex(indexData, style){
  var source = fs.readFileSync(__dirname + '/../views/layout/index.html');
  var template = Handlebars.compile(source.toString());
  var data = {
    post: indexData,
    style: style
  };
  return template(data);
}

registerPartials();

module.exports = {
  buildPost: buildPost,
  buildIndex: buildIndex
};
