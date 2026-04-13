/**
 * Builds locale-specific pages from site.template.html.
 * Run from repo root: node tools/build-locales.cjs
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const templatePath = path.join(root, 'site.template.html');
const BASE = 'https://vivepage.com';

function inject(html, map) {
  let out = html;
  for (const [key, val] of Object.entries(map)) {
    out = out.split(key).join(val);
  }
  return out;
}

const template = fs.readFileSync(templatePath, 'utf8');

const META_ES =
  'VivePage: desarrollo y diseño de webs y landing pages profesionales a bajo costo. Entrega rápida, trato personal, sin burocracia ni complicaciones. Dominio .com y planes claros para médicos, abogados, coaches y profesionales independientes.';

const META_EN =
  'VivePage: affordable website and landing page design and development. Fast delivery, personal service, no bureaucracy or hassle. Clear one-time plans for physicians, lawyers, coaches and independent professionals.';

const variants = {
  es: {
    __HTML_LANG__: 'es',
    __CANONICAL_URL__: `${BASE}/es/`,
    __HOME_URL__: '/es/',
    __LANG_SWITCH_URL__: '/en/',
    __LANG_SWITCH_TEXT__: 'EN',
    __LANG_SWITCH_ARIA__: 'Cambiar a inglés',
    __FIXED_LANG__: 'es',
    __OG_TITLE__: 'VivePage — Diseño web profesional',
    __OG_LOCALE__: 'es_ES',
    __OG_LOCALE_ALT__: 'en_US',
    __META_DESCRIPTION__: META_ES,
  },
  en: {
    __HTML_LANG__: 'en',
    __CANONICAL_URL__: `${BASE}/en/`,
    __HOME_URL__: '/en/',
    __LANG_SWITCH_URL__: '/es/',
    __LANG_SWITCH_TEXT__: 'ES',
    __LANG_SWITCH_ARIA__: 'Switch to Spanish',
    __FIXED_LANG__: 'en',
    __OG_TITLE__: 'VivePage — Professional web design',
    __OG_LOCALE__: 'en_US',
    __OG_LOCALE_ALT__: 'es_ES',
    __META_DESCRIPTION__: META_EN,
  },
};

for (const lang of Object.keys(variants)) {
  const dir = path.join(root, lang);
  fs.mkdirSync(dir, { recursive: true });
  const html = inject(template, variants[lang]);
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

const redirectPage = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${META_ES.replace(/"/g, '&quot;')}" />
  <title>VivePage</title>
  <link rel="canonical" href="${BASE}/es/" />
  <link rel="alternate" hreflang="es" href="${BASE}/es/" />
  <link rel="alternate" hreflang="en" href="${BASE}/en/" />
  <link rel="alternate" hreflang="x-default" href="${BASE}/es/" />
  <meta http-equiv="refresh" content="0; url=/es/" />
  <script>location.replace('/es/');</script>
</head>
<body>
  <p style="font-family:system-ui,sans-serif;padding:1.5rem;">
    <a href="/es/">VivePage — Español</a>
    ·
    <a href="/en/">English</a>
  </p>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'index.html'), redirectPage, 'utf8');

const lastmod = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${BASE}/es/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${BASE}/es/" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE}/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/es/" />
  </url>
  <url>
    <loc>${BASE}/en/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${BASE}/es/" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE}/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/es/" />
  </url>
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap.trim() + '\n', 'utf8');

const robots = `User-agent: *
Allow: /

Sitemap: ${BASE}/sitemap.xml
`;

fs.writeFileSync(path.join(root, 'robots.txt'), robots, 'utf8');

console.log(
  'Wrote es/index.html, en/index.html, root index.html, sitemap.xml, robots.txt.'
);
