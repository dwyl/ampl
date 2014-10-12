var fs = require('fs');
var path = require('path');


// date-ordered (descending) list of posts
function getPosts(callback) {
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
          post.title = getTitle(data);
          post.slug  = slug(post.title);
          post.intro = getIntro(data);
          post.mtime = stats.mtime;
          post.full = data;
          posts.push(post);

          if(--remaining === 0){
            // sorts potsts by date decending (newest first)
            posts.sort(function(a,b){
              return b.mtime - a.mtime;
            }); // see: http://stackoverflow.com/questions/10123953

            callback(errors, posts);
          }
        });
      }
    });
  });
}

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

function buildFullPost (post) {

}

module.exports = {
  getPosts : getPosts
};
