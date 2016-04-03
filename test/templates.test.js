import test from 'tape';

import { createAmpPage } from '../src/templates.js';
import { parse } from '../src/ampl.js';

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
  t.ok(ampHtml.indexOf(html) !== -1, "html inserted into amp template");
  t.ok(ampHtml.indexOf(style) !== -1, "style inserted into amp template");
  t.ok(
    ampHtml.split('\n')[2].split(' ')[1].indexOf('amp') === 0,
    'html tag contains amp keyword'
  );
  t.end();
});

test('custom props', t=> {
  let expected;
  const opts = {
    style: 'style',
    canonicalUrl: 'canonicalUrl',
    title: 'title',
    extraHeadHTML: 'extraHeadHTML'
  };
  parse('markdown', opts, ampHtml => {
    console.log(ampHtml);

    expected = `<link rel="canonical" href="canonicalUrl">`;
    t.ok(ampHtml.indexOf(expected) !== -1, 'canonicalUrl input correctly');

    expected = `<style amp-custom>
      style
    </style>`;
    t.ok(ampHtml.indexOf(expected) !== -1, 'style input correctly');

    expected = `<title>title</title>`;
    t.ok(ampHtml.indexOf(expected) !== -1, 'title input correctly');

    expected = `extraHeadHTML
  </head>`;
    t.ok(ampHtml.indexOf(expected) !== -1, 'extra head input correctly');


    t.end();
  })
});
