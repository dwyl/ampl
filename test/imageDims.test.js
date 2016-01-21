var test = require('tape');

import { parse } from '../src/ampl.js';

test('image dimensions found', t=> {
  var testMd =
    '![image](https://cloud.githubusercontent.com/assets/12845233/12449931/68f11832-bf78-11e5-87ff-d34e6a3487c6.png)' +
    '![image](http://www.lightningsafety.noaa.gov/photos/Lightning%202a.jpg)' +
    '![image](https://raw.github.com/nelsonic/learning-istanbul/master/screenshots/97-percent-hides-malicious-code.png)';

  parse(testMd, '', function(ampHtml) {
    t.ok(ampHtml.indexOf(`width="439"`) !== -1, 'image has correct width');
    t.ok(ampHtml.indexOf(`height="20"`) !== -1, 'image has correct height');
    t.end();
  });
});

test('ampl does not fail when there are no images in the markdown', t=> {
  var testMd = 'hi there'
  parse(testMd, '', function(ampHtml) {
    t.ok(ampHtml.indexOf(`hi there`) !== -1, 'amp html created without error');
    t.end();
  });
});
