var test = require('tape');

var ampHtml = require('../lib/templates.js');

test("template.js", t => {
  var style = "here is some styling";
  var html = "<this is not a tag>";
  var ampHtml = html2Amp(style, html);
  t.ok(ampHtml.indexOf(html) !== -1, "html inserted into amp template");
  t.ok(ampHtml.indexOf(style) !== -1, "style inserted into amp template");
  t.ok(ampHtml.split('\n')[3].split(' ')[3].indexOf('amp') === 0,
    'html tag contains amp keyword');
  t.end();
});

// test("template contains html amp tag" t => {
//
// });
