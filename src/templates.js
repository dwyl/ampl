var createAmpHeader = style => `
  <!doctype html>
  <html amp>
    <head>
      <meta charset="utf-8">
      <link rel="canonical" href="default.html" >
      <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
      <style amp-custom>
        ${style}
      </style>
      <style>body {opacity: 0}</style><noscript><style>body {opacity: 1}</style></noscript>
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <title>Index</title>
    </head>
`;

var createLinkHtml = link => `
<a href='${link}'>${link}</a>
`;

export var html2Amp = (style, contentHTML) => `
  ${createAmpHeader(style)}
    <body>
      ${contentHTML}
    </body>
  </html>
`;
//
// export var buildIndex = (style, linksArr) => `
//   ${createAmpHeader(style)}
//   <body>
//     ${contentHTMLArr.map(createLinkHtml)}
//   </body>
// </html>
// `;
