import test from 'tape';
import nock from 'nock';
import { parse } from '../src/ampl.js';

test('image dimensions found', t=> {
  const testMd =
    `
# h1

![image](https://mock1.io/pic1.jpg)
![image](http://www.mock2.io/pic2.jpg)
![image](http://www.mock2.io/pic3.jpg)
![image](http://www.mock2.io/notAPic)
![image](http://notaurl.jpg)`;

  nock('https://mock1.io')
    .get('/pic1.jpg')
    .replyWithFile(200, __dirname + '/mock_image.jpg');
  nock('http://www.mock2.io')
    .get('/pic2.jpg')
    .replyWithFile(200, __dirname + '/mock_image.jpg');
  nock('http://www.mock2.io')
    .get('/notAPic')
    .reply(200, 'hi there');
  nock('http://www.mock2.io')
    .get('/pic2.jpg')
    .reply(400);

  parse(testMd, '', ampHtml => {
    console.log('@@@@@@@@@@@@@@@');
    console.log(ampHtml);
    t.ok(ampHtml.indexOf(`width="32"`) !== -1, 'image has correct width');
    t.ok(ampHtml.indexOf(`height="32"`) !== -1, 'image has correct height');
    t.end();
  });
});

test('ampl does not fail when there are no images in the markdown', t=> {
  const testMd = 'hi there'
  parse(testMd, '', ampHtml => {
    t.ok(ampHtml.indexOf(`hi there`) !== -1, 'amp html created without error');
    t.end();
  });
});
