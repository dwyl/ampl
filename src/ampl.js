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
};

const attribStr = attribs => Object.keys(attribs).map(attribKey =>
  attribs[attribKey].length === 0 ?
    attribKey :
    ` ${attribKey}='${attribs[attribKey]}'`
).join('');

const createParseRules = () => [
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

const parseHtml = (html, callback) => {
  const parseRules = createParseRules();
  const tagStack = [{text: "<!doctype html>"}];
  const parser = new htmlparser.Parser({
    onopentag: (name, attribs) => {
      tagStack.push({name, attribs,
        text: ""
      });
      parseRules.forEach(rule => {
        if (rule.onOpenTag && !(rule.target && rule.target !== name)) {
          rule.onOpenTag(attribs);
        }
      });
    },
    ontext: text => {
      tagStack[tagStack.length-1].text += text;
    },
    onclosetag: name => {
      const tag = tagStack.pop();
      let text = tag.text;
      parseRules.forEach(rule => {
        if (rule.onCloseTag && !(rule.target && rule.target !== name)) {
          text = rule.onCloseTag(text);
        }
      });
      tagStack[tagStack.length-1].text +=
        `<${tag.name} ${attribStr(tag.attribs)}>${text}</${tag.name}>`;
    },
    onend: () => {
      const ruleOutput = parseRules.reduce((data, rule) => {
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
