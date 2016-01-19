var Remarkable = require('remarkable');

import { getDims } from './imageDims.js';
import { html2Amp } from './templates.js';

export function parse(mdString, callback) {
  var md = new Remarkable('full');
  var htmlString = md.render(mdString);
  getDims(htmlString, function(dimensions) {
    var i = 0;
    var imageTagRegex = /(<img)/;
    while(imageTagRegex.test(htmlString)) {
      var newTag =
        '<amp-img width=\"' + dimensions[i].width +
        '\" height=\"' + dimensions[i].height + '\"';
      htmlString = htmlString.replace(imageTagRegex, newTag);
      i += 1;
    }
    var ampHtml = html2Amp("", htmlString);
    callback(ampHtml);
  });
};
