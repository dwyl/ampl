import test from 'tape';

import { createAmpPage } from '../src/templates.js'

test("template.js", t => {
  const style = "here is some styling";
  const html = "<this is not a tag>";
  const ampHtml = createAmpPage(html, {style});
  t.ok(ampHtml.indexOf(html) !== -1, "html inserted into amp template");
  t.ok(ampHtml.indexOf(style) !== -1, "style inserted into amp template");
  t.ok(ampHtml.split('\n')[1].split(' ')[3].indexOf('amp') === 0,
    'html tag contains amp keyword');
  t.end();
});
