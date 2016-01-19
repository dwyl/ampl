// load dependencies
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var fs = require('fs');
var util = require('util');
var getPosts = require('./lib/helpers.js').getPosts;
var buildAmpPost = require('./lib/handlebars.js').buildPost;
var buildAmpIndex = require('./lib/handlebars.js').buildIndex;

var style = fs.readFileSync(__dirname + '/styles/markdownstyle.css');

getPosts(function(err, posts) {
  var postUrls = posts.map(function(post) {
    return './' + post.slug + '.html';
  });
  // console.log(postUrls);
  // console.log(util.inspect(posts));
  var countdown = posts.length;

  var path = __dirname + '/.site';

  rimraf(path, function(err) {
    if (err) throw err;
    mkdirp(path, function(err) {
      if (err) throw err;
      fs.writeFile(path + '/index.html', buildAmpIndex(postUrls, style), function(err) {
        if (err) throw err;
        posts.forEach(function(post) {
          var full = buildAmpPost(post.html, style);
          var destination = path + '/' + post.slug + '.html';

          fs.writeFile(destination, full, function(err) {
            if (err) throw err;
            console.log('done');
          });
        });
      });
    });
  });
});

// need to use a Template Lib for this!!
function titleLink(post) {
  return '<h1><a href="/posts/' + post.slug + '.html">' + post.title + '</a></h1>';
}

// output everything into index.html
// output each post into its respective post-name.html
