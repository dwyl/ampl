var fs = require('fs');
var Handlebars = require('handlebars');
var source = fs.readFileSync(__dirname + '/../views/layout/default.html');

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function buildPost(postData) {
  var template = Handlebars.compile(ab2str(source));
  // console.log('postData: !!! >>>', postData);
  var data = {
    "content": postData
  };

  return template(data);
}

// console.log(buildPost('<h1> Yo </h1>'));

module.exports = {
  buildPost: buildPost
}
