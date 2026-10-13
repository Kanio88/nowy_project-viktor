import { cp, mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { loadContent, root } from './content.mjs'

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

// Visual Editor annotations are emitted only for the editor's dev server.
// Production HTML stays byte-for-byte identical to the pre-annotation build.
const objectAttr = (on, id) => (on ? ` data-sb-object-id="${id}"` : '')
const fieldAttr = (on, fieldPath) => (on ? ` data-sb-field-path="${fieldPath}"` : '')

export function createRenderer({ site, annotate = false }) {
  const canonicalHost = site.canonicalHost
  const absoluteUrl = (pathname) => pathname === '/' ? `${canonicalHost}/` : `${canonicalHost}${pathname}/`

  function navigation() {
    const links = site.nav
      .map((link) => `      <a href="${link.href}">${escapeHtml(link.label)}</a>`)
      .join('\n')
    return `
    <nav aria-label="Primary navigation"${fieldAttr(annotate, 'nav')}>
${links}
    </nav>`
  }

  function contactSection() {
    const { heading, bookHref, bookLabel } = site.contactCta
    return `
        <section>
          <h2${fieldAttr(annotate, 'contactCta.heading')}>${escapeHtml(heading)}</h2>
          <p>Call <a href="tel:${site.business.telephone}">${escapeHtml(site.phoneDisplay)}</a>, email <a href="mailto:${site.business.email}">${escapeHtml(site.business.email)}</a>, or <a href="${bookHref}">${escapeHtml(bookLabel)}</a>.</p>
        </section>`
  }

  function footer() {
    const links = site.footer.links
      .map((link) => `<a href="${link.href}">${escapeHtml(link.label)}</a>`)
      .join(' · ')
    return `
      <footer${objectAttr(annotate, site.objectId)}>
        <p${fieldAttr(annotate, 'footer.legalLine')}>${escapeHtml(site.footer.legalLine)}</p>
        <p>${links}</p>
      </footer>`
  }

  function fallbackContent(page) {
    const sections = page.sections.map((section, index) => `
    <section${fieldAttr(annotate, `sections.${index}`)}>
      <h2${fieldAttr(annotate, `sections.${index}.heading`)}>${escapeHtml(section.heading)}</h2>
      <p${fieldAttr(annotate, `sections.${index}.body`)}>${escapeHtml(section.body)}</p>
    </section>`).join('')

    return `
    <main id="pre-rendered-content"${objectAttr(annotate, page.objectId)}>
      <header${objectAttr(annotate, site.objectId)}>
        <p><a href="/"${fieldAttr(annotate, 'brandName')}>${escapeHtml(site.brandName)}</a></p>
        ${navigation()}
      </header>
      <article>
        <h1${fieldAttr(annotate, 'h1')}>${escapeHtml(page.h1)}</h1>
        <p${fieldAttr(annotate, 'intro')}>${escapeHtml(page.intro)}</p>
        ${sections}${contactSection()}
      </article>${footer()}
    </main>`
  }

  function localBusinessSchema() {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: site.business.name,
      description: site.schemaDescription,
      url: site.business.url,
      image: `${canonicalHost}${site.ogImage}`,
      telephone: site.business.telephone,
      email: site.business.email,
      address: site.business.address,
      areaServed: site.business.areaServed,
      sameAs: site.social,
    }).replaceAll('</', '<\\/')
  }

  function stylesheetTags() {
    const primary = site.assets.stylesheets
      .map((href) => `    <link rel="stylesheet" crossorigin href="${href}" />`)
    const extra = site.assets.extraStylesheets
      .map((href) => `    <link rel="stylesheet" href="${href}" />`)
    const scripts = site.assets.deferScripts
      .map((src) => `    <script defer src="${src}"></script>`)
    return [...primary, ...extra, ...scripts].join('\n')
  }

  function pageHtml(page) {
    const url = absoluteUrl(page.urlPath)
    const title = escapeHtml(page.title)
    const description = escapeHtml(page.description)
    return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <meta name="robots" content="index,follow" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(site.brandName)}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${canonicalHost}${site.ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${canonicalHost}${site.ogImage}" />
    <meta name="theme-color" content="${site.themeColor}" />
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');</script>
    <script type="application/ld+json">${localBusinessSchema()}</script>
    <script type="module" crossorigin src="${site.assets.module}"></script>
${stylesheetTags()}
  </head>
  <body>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${site.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <div id="root">${fallbackContent(page)}</div>
  </body>
</html>
`
  }

  function notFoundHtml() {
    const { title, description, h1, intro } = site.notFound
    return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex,follow" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonicalHost}/404" />
    <link rel="stylesheet" crossorigin href="${site.assets.stylesheets[0]}" />
  </head>
  <body>
    <main>
      <h1>${escapeHtml(h1)}</h1>
      <p>${escapeHtml(intro)}</p>
      <p><a href="/">Return home</a>, <a href="/services">view services</a>, <a href="/contact">contact us</a>, or call <a href="tel:${site.business.telephone}">${escapeHtml(site.phoneDisplay)}</a>.</p>
    </main>
  </body>
</html>
`
  }

  return { absoluteUrl, pageHtml, notFoundHtml }
}

export async function buildSite({ outDir, annotate = false } = {}) {
  const dist = outDir ?? path.join(root, 'dist')
  const { site, pages } = await loadContent()
  const { absoluteUrl, pageHtml, notFoundHtml } = createRenderer({ site, annotate })

  await rm(dist, { recursive: true, force: true })
  await mkdir(dist, { recursive: true })

  for (const directory of ['assets', 'images']) {
    await cp(path.join(root, directory), path.join(dist, directory), { recursive: true })
  }
  for (const file of ['favicon.png', 'apple-touch-icon.png']) {
    await cp(path.join(root, file), path.join(dist, file))
  }

  await Promise.all(pages.map(async (page) => {
    const directory = page.urlPath === '/' ? dist : path.join(dist, page.urlPath.slice(1))
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, 'index.html'), pageHtml(page), 'utf8')
  }))

  await writeFile(path.join(dist, '404.html'), notFoundHtml(), 'utf8')
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.canonicalHost}/sitemap.xml\n`, 'utf8')
  const urls = pages.map((page) => `  <url><loc>${absoluteUrl(page.urlPath)}</loc></url>`).join('\n')
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8')
  await writeFile(path.join(dist, '_redirects'), '# No SPA catch-all: unknown paths must return the real 404.html response.\n', 'utf8')
  await writeFile(path.join(dist, 'build-manifest.json'), JSON.stringify({ routes: pages.map(({ urlPath, title }) => ({ path: urlPath, title })), generatedAt: new Date().toISOString() }, null, 2), 'utf8')

  return { dist, count: pages.length }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]).endsWith(path.join('scripts', 'build-static-site.mjs'))

if (isDirectRun) {
  buildSite({ annotate: process.env.STACKBIT_ANNOTATE === '1' })
    .then(({ dist, count }) => console.log(`Built ${count} pre-rendered routes in ${dist}`))
    .catch((error) => {
      console.error(error)
      process.exitCode = 1
    })
}
