var Remarkable = require('remarkable');
var htmlparser = require("htmlparser2");

var remarkable = new Remarkable('full');

import { getDims } from './imageDims.js';
import { html2Amp } from './templates.js';

export function parse(mdString, css, callback) {
  var htmlRaw = remarkable.render(mdString);
  var htmlAmp = html2Amp(css, htmlRaw)
  parseHtml(htmlAmp, function(htmlAmp, data) {
    getDims(data.urls, function(dimensions) {
      // todo remove while loop
      var i = 0;
      var imageTagRegex = /(<img)/;
      while(imageTagRegex.test(htmlAmp)) {
        var newTag = `
          <amp-img
            width="${dimensions[i].width}"
            height="${dimensions[i].height}"
            layout="responsive"
        `;
        htmlAmp = htmlAmp.replace(imageTagRegex, newTag);
        i += 1;
      }
      callback(htmlAmp);
    });
  });
};

var attribStr = attribs => Object.keys(attribs).map(attribKey => (
  attribs[attribKey].length === 0 ?
    attribKey :
    `${attribKey}='${attribs[attribKey]}'`
)).join(' ');

var createParseRules = () => [
  (urls => ({
    label: "urls",
    target: "img",
    onOpenTag: attribs => urls.push(attribs.src),
    getResults: () => urls
  }))([]),
  {
    label: "wrapper-main",
    target: "body",
    onCloseTag: text => `
      <div class="wrapper-main">
        ${text}
      </div>
    `
  }
];

var parseHtml = function(html, callback) {
  var parseRules = createParseRules();
  var tagStack = [{text: "<!doctype html>"}];
  var parser = new htmlparser.Parser({
    onopentag: function(name, attribs) {
      tagStack.push({name, attribs,
        text: ""
      });
      parseRules.forEach(rule => {
        if (rule.onOpenTag && !(rule.target && rule.target !== name)) {
          rule.onOpenTag(attribs);
        }
      });
    },
    ontext: function(text) {
      tagStack[tagStack.length-1].text += text;
    },
    onclosetag: function(name) {
      var tag = tagStack.pop();
      var text =
        `<${tag.name} ${attribStr(tag.attribs)}>${tag.text}</${tag.name}>`;
      parseRules.forEach(rule => {
        if (rule.onCloseTag && !(rule.target && rule.target !== name)) {
          text = rule.onCloseTag(text);
        }
      });
      tagStack[tagStack.length-1].text += text;
    },
    onend: function() {
      var ruleOutput = parseRules.reduce((data, rule) => {
        if (typeof rule.getResults === 'function') {
          data[rule.label] = rule.getResults();
        }
        return data;
      }, {});
      callback(tagStack[0].text, ruleOutput);
    }
  });
  parser.write(html);
  parser.end();
};
