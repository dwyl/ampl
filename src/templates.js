const createAmpHeader = ({
  headOverride, style, canonicalUrl, title, extraHeadHTML
}) => typeof headOverride === 'string' ? headOverride : (
`<!doctype html>
  <html amp>
    <head>
      <meta charset="utf-8">
      <link rel="canonical" href="${canonicalUrl || ""}" >
      <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
      <style amp-custom>
        ${style || ""}
      </style>
      <style>body {opacity: 0}</style><noscript><style>body {opacity: 1}</style></noscript>
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <title>${title || ""}</title>
      ${extraHeadHTML || ""}
    </head>`
  );

export const createAmpPage = (contentHTML, opts) => (
`${createAmpHeader(opts)}
  <body>
    ${contentHTML}
  </body>
</html>`
);
