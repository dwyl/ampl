import assert from 'assert';
import sizeOf from 'image-size';
import http from 'http';
import https from 'https';
import url from 'url';

export const getDims = (imageUrls, callback) => {
  const totalLinks = imageUrls.length;
  if (totalLinks === 0) {
    setTimeout(() => callback([]), 0);
  } else {
    imageUrls.forEach((imageUrl, index) => {
      const options = url.parse(imageUrl);
      const proto = options.protocol === 'https:' ? https : http;
      const request = proto.request(options, response =>
        getBody(response, body => {
          let dims;
          try {
            dims = sizeOf(body);
          } catch(e) {
            dims = {
              width: 0,
              height: 0
            }
            console.warn('failed to find size of image', imageUrl);
          }
          next(dims, index);
        })
      );
      request.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
        next({
          width: 0,
          height: 0
        }, index);
      });
      request.end();
    });
  }
  const next = asyncCaller(totalLinks, callback);
};

const asyncCaller = (length, callback) => {
  const results = [];
  let counter = 0;
  return (result, i) => {
    counter += 1;
    results[i] = result;
    if (counter === length) {
      callback(results);
    }
  };
};

const imageTagRegex = /(<img)/;
export const updateImgTags = (html, dimensions) => imageTagRegex.test(html)
  ? updateImgTags(html.replace(imageTagRegex, `<amp-img
      width="${dimensions[0].width}"
      height="${dimensions[0].height}"
      layout="responsive"`
    ), dimensions.slice(1))
  : html;

const getBody = (response, callback) => {
  const chunks = [];
  response.on('data', chunk => {
    chunks.push(chunk);
    if (chunks.length === 2) {
      callback(Buffer.concat(chunks));
    }
  });
  response.on('end', () => {
    if (chunks.length < 2) {
      callback(Buffer.concat(chunks));
    }
  });
};
