import Remarkable from 'remarkable';
import htmlparser from 'htmlparser2';

import { getDims, updateImgTags } from './imageDims.js';
import { createAmpPage } from './templates.js';

const remarkable = new Remarkable('full');

export const parse = (markdown, optsOrStyle, callback) => {
  const opts = typeof optsOrStyle === 'string' ?
    {style: optsOrStyle} : optsOrStyle;
  markdown2AmpHTML({ markdown }, HTML =>
    callback(createAmpPage(HTML, opts))
  );
};

export const markdown2AmpHTML = (opts, callback) => {
  const { markdown } = opts;
  const htmlRaw = remarkable.render(markdown);
  parseHtml(htmlRaw, (html, { imageUrls }) =>
    getDims(imageUrls, (dimensions) =>
      callback(updateImgTags(html, dimensions))
    )
  );
}

var attribStr = attribs => Object.keys(attribs).map(attribKey => (
  attribs[attribKey].length === 0 ?
    attribKey :
    ` ${attribKey}='${attribs[attribKey]}'`
)).join('');

var createParseRules = () => [
  (urls => ({
    label: "imageUrls",
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
      var text = tag.text;
      parseRules.forEach(rule => {
        if (rule.onCloseTag && !(rule.target && rule.target !== name)) {
          text = rule.onCloseTag(text);
        }
      });
      tagStack[tagStack.length-1].text +=
        `<${tag.name} ${attribStr(tag.attribs)}>${text}</${tag.name}>`;
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
