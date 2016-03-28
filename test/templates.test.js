import test from 'tape';

import { createAmpPage } from '../src/templates.js';

const getFirstInner = (tag, html) => html
  .split(`<${tag}>`)[1]
  .split(`</${tag}>`)[0];

test('headOverride', t => {
  const replacementHead = 'replace standard amp head with me';
  const ampHtml = createAmpPage('soome html', {headOverride: replacementHead});
  const expected = replacementHead;
  const actual = ampHtml.split('')
  t.equal(getFirstInner('head', ampHtml), replacementHead, 'head replaced');
  t.end();
});

test("template.js", t => {
  const style = "here is some styling";
  const html = "<this is not a tag>";
  const ampHtml = createAmpPage(html, {style});
  console.log('###', ampHtml);
  t.ok(ampHtml.indexOf(html) !== -1, "html inserted into amp template");
  t.ok(ampHtml.indexOf(style) !== -1, "style inserted into amp template");
  console.log(ampHtml.split('\n')[2]);
  t.ok(ampHtml.split('\n')[2].split(' ')[1].indexOf('amp') === 0,
    'html tag contains amp keyword');
  t.end();
});
