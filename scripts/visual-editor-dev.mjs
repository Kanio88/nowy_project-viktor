import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { loadContent, root } from './content.mjs'
import { createRenderer } from './build-static-site.mjs'

const portArgIndex = process.argv.indexOf('--port')
const port = Number(
  (portArgIndex !== -1 && process.argv[portArgIndex + 1]) || process.env.PORT || 8089,
)

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

// Served directly from the repo so the prebuilt bundle, stylesheets and images
// render exactly as they do in production.
const staticRoots = ['assets', 'images', 'public']
const staticFiles = ['favicon.png', 'apple-touch-icon.png', 'robots.txt', 'sitemap.xml']

// Visual Editor writes content changes to disk and then fires
// `stackbitObjectsChanged`. Content is re-read on every request, so a reload is
// enough to show the new values.
const reloadScript = `
    <script>
      window.addEventListener('stackbitObjectsChanged', function () {
        window.location.reload()
      })
    </script>`

const withReloadScript = (html) => html.replace('  </body>', `${reloadScript}\n  </body>`)

function sendStatic(response, filePath) {
  response.writeHead(200, {
    'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  })
  createReadStream(filePath).pipe(response)
}

function resolveStatic(pathname) {
  const relative = pathname.replace(/^\/+/, '')
  if (!relative) return null
  const segment = relative.split('/')[0]
  if (!staticRoots.includes(segment) && !staticFiles.includes(relative)) return null
  const target = path.join(root, relative)
  if (!target.startsWith(root) || !existsSync(target) || statSync(target).isDirectory()) return null
  return target
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
    const pathname = path.posix.normalize(decodeURIComponent(url.pathname))

    const staticFile = resolveStatic(pathname)
    if (staticFile) {
      sendStatic(response, staticFile)
      return
    }

    // Reloaded per request so edits land without restarting the server.
    const { site, pages } = await loadContent()
    const { pageHtml, notFoundHtml } = createRenderer({ site, annotate: true })

    const wanted = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
    const page = pages.find((candidate) => candidate.urlPath === wanted)

    if (!page) {
      response.writeHead(404, { 'Content-Type': mimeTypes['.html'], 'Cache-Control': 'no-store' })
      response.end(withReloadScript(notFoundHtml()))
      return
    }

    response.writeHead(200, { 'Content-Type': mimeTypes['.html'], 'Cache-Control': 'no-store' })
    response.end(withReloadScript(pageHtml(page)))
  } catch (error) {
    console.error(error)
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Dev server error — see terminal output.')
  }
})

// Bind to all interfaces: the hosted Visual Editor reaches the server
// through a non-localhost host.
server.listen(port, '0.0.0.0', () => {
  console.log(`Visual Editor dev server ready on http://localhost:${port}`)
})
