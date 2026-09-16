const BRAND_IMAGE = '/brand/meeple-mentor-icon-blue-gold-rims.png';
const DESCRIPTION = 'Bilingual board game guides, recap quizzes, and rules Q&A. Keep the game moving with Meeple Mentor.';

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Render in the initial HTML so link-preview crawlers do not need JavaScript.
export function addSiteMetadata(html, req, configuredOrigin) {
  if (!html.includes('</head>')) return html;
  const protocol = req.headers['x-forwarded-proto']?.split(',')[0].trim() === 'https' || req.socket.encrypted ? 'https' : 'http';
  const origin = new URL(configuredOrigin || `${protocol}://${req.headers.host}`).origin;
  const image = escapeAttribute(new URL(BRAND_IMAGE, origin).href);
  // Titles and descriptions already contain HTML entities; preserve them.
  const title = (html.match(/<title>([^<]*)<\/title>/i)?.[1] || 'Meeple Mentor').replace(/"/g, '&quot;');
  const existingDescription = html.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?\s*>/i)?.[1];
  const description = existingDescription || DESCRIPTION;
  const tags = [
    `<link rel="icon" type="image/png" sizes="1254x1254" href="${BRAND_IMAGE}" />`,
    `<link rel="apple-touch-icon" href="${BRAND_IMAGE}" />`,
    '<meta name="theme-color" content="#206fa8" />',
    ...(!existingDescription ? [`<meta name="description" content="${description}" />`] : []),
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Meeple Mentor" />',
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:type" content="image/png" />',
    '<meta property="og:image:width" content="1254" />',
    '<meta property="og:image:height" content="1254" />',
    '<meta property="og:image:alt" content="Meeple Mentor — a blue meeple on an open book with gold page accents" />',
    '<meta name="twitter:card" content="summary" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    '<meta name="twitter:image:alt" content="Meeple Mentor logo" />',
  ];
  return html.replace('</head>', `  ${tags.join('\n    ')}\n  </head>`);
}
