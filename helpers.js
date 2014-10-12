var fs = require('fs');
var path = require('path');
var util = require('util');
// date-ordered (descending) list of posts
// get list of markdown (.md) files in ./posts dir
var files = fs.readdirSync(path.resolve('./posts'));
var posts = {};
var errors = [];

console.log(files.length, files)
// reduce list of files to only markdown
var mds = files.map(function(file) {
  if(path.extname(file).toLowerCase() === '.md') {
    return file;
  }
});
// remove undefined, null, etc. - http://stackoverflow.com/questions/281264
mds = mds.filter(function(n){ return n });

// number of markdown files (posts)

remaining = mds.length;
console.log(remaining, mds);

mds.map(function(file){
  var filepath = path.resolve('./posts/'+file);
  fs.stat(filepath, function(err, stats){
    errors.push(err);
    // console.log(stats);
    if(!err){
      fs.readFile(filepath, 'utf8', function(error, data){
        posts[file] = {};
        posts[file].lastmod = stats.mtime;
        posts[file].data = data;
        // console.log(data);
        // console.log(remaining--);
        if(--remaining === 0){
          console.log('>>> finished');
          // this is where the callback goes
          console.log(util.inspect(posts));
        }
      });
      // console.log(stats);
    }
  });
});

// loop through all the .md files in ./posts
