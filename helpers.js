var fs = require('fs');
var path = require('path');

var h = {};
// date-ordered (descending) list of posts
h.getPosts = function(callback) {
  var files = fs.readdirSync(path.resolve('./posts'));
  var posts = [];  // date-ordered array of posts
  var errors = []; // an array of all errors

  // reduce list of files to only markdown
  var mds = files.map(function(file) {
    if(path.extname(file).toLowerCase() === '.md') {
      return file;
    }
  });
  // remove undefined, null, etc. - http://stackoverflow.com/questions/281264
  mds = mds.filter(function(n){ return n });

  // number of markdown files (posts)
  remaining = mds.length; // we decrement this below

  mds.map(function(file){
    var filepath = path.resolve('./posts/'+file);
    fs.stat(filepath, function(err, stats){
      errors.push(err);
      // console.log(stats);
      if(!err) {

        fs.readFile(filepath, 'utf8', function(error, data){
          errors.push(error);
          var post = {path:filepath};

          post.title = h.getTitle(data);
          post.slug  = h.slug(post.title);
          post.intro = h.getIntro(data);
          post.mtime = stats.mtime;
          post.full = data;
          posts.push(post);

          if(--remaining === 0){
            // sorts potsts by date decending (newest first)
            posts.sort(function(a,b){
              return b.mtime - a.mtime;
            }); // see: http://stackoverflow.com/questions/10123953
            //console.log(posts);
            callback(errors, posts);
          }
        });
      }
    });
  });
};

// convert title to url http://stackoverflow.com/questions/1983648
h.slug = function (title) {
  return title.replace(/\s+/g, '-').toLowerCase();
};

// extract post title
h.getTitle = function (post) {
  var title =  post.toString().split('\n')[0].replace(/#/g, '').trim();
  return title;
};

// extract the first few lines of the post
h.getIntro = function (post, lineLimit) {
  lineLimit = lineLimit || 5;
  // separate lines in markdown
  var lines = post.toString().split('\n');
  var end = lines.length > lineLimit ? lineLimit : lines.length;
  // assumes first line is the title
  var intro = lines.slice(1, end).join('\n');
  return intro;
};

// tbc
h.buildFullPost = function (post) {

};

module.exports = h;
