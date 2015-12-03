var fs = require('fs');
var path = require('path');
var mdParser = require('./markdown-amp.js');

// date-ordered (descending) list of posts
function getPosts(callback) {
  var files = fs.readdirSync(path.resolve('./posts'));
  var posts = [];  // date-ordered array of posts
  var errors = []; // an array of all errors

  // reduce list of files to only markdown
  // mds is an array of file names of all md files in specified directory
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
    // var stats = fs.statSync(filepath);
    // var data = fs.readFileSync(filepath);


    fs.stat(filepath, function(err, stats){
      errors.push(err);
      // console.log(stats);
      if(!err) {
        fs.readFile(filepath, 'utf8', function(error, data){
          errors.push(error);
          mdParser(data, function(postHtml) {
            var post = {};
            post.path = filepath;
            post.title = getTitle(data);
            post.slug  = slug(post.title);
          //  post.intro = getIntro(data);
            post.mtime = stats.mtime;
            post.html = postHtml;
            posts.push(post);
            if(--remaining === 0){
              // sorts potsts by date decending (newest first)
              posts.sort(function(a,b){
                return b.mtime - a.mtime;
              }); // see: http://stackoverflow.com/questions/10123953
              callback(errors, posts);
            }
          });
          // var post = {path:filepath};
          // post.title = getTitle(data);
          // post.slug  = slug(post.title);
          // post.intro = getIntro(data);
          // post.mtime = stats.mtime;
          // post.full = data;


        });
      }
    });
  });
}

// convert title to url http://stackoverflow.com/questions/1983648
function slug (title) {
  return title.replace(/\s+/g, '-').toLowerCase();
}

// extract post title
function getTitle (post) {
  return post.toString().split('\n')[0].replace(/#/g, '').trim();
}

// extract the first few lines of the post
function getIntro (post, lineLimit) {
  lineLimit = lineLimit || 5;
  // separate lines in markdown
  var lines = post.toString().split('\n');
  var end = lines.length > lineLimit ? lineLimit : lines.length;
  // assumes first line is the title
  return lines.slice(1, end).join('\n');
}

// tbc
function buildFullPost (post) {

}

module.exports = {
  getPosts : getPosts
};
