var ampl = require('../src/ampl');
var markdownString = '# Hello World!'; // or read from a .md file
var cssStyle = 'h1 { color: green; }'; // or load your style.css file
ampl.parse(markdownString, cssStyle, function(ampHtml) {
  console.log(ampHtml);
});
