var test = require('tape');

var parse = require('../lib/ampl.js');

test('image dimensions found', t=> {
  var testMd = '![image](https://cloud.githubusercontent.com/assets/12845233/12449931/68f11832-bf78-11e5-87ff-d34e6a3487c6.png)'
  parse(testMd, '', function(ampHtml) {
    t.ok(ampHtml.indexOf(`width="439"`) !== -1, 'image has correct width');
    t.ok(ampHtml.indexOf(`height="20"`) !== -1, 'image has correct height');
    t.end();
  });
})
