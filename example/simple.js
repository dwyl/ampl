import { parse } from '../src/ampl';
const markdownString = '# Hello World!'; // or read from a .md file
const cssStyle = 'h1 { color: green; }'; // or load your style.css file
parse(markdownString, cssStyle, function(ampHtml) {
  console.log(ampHtml);
});
