import { createReadStream, existsSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const port = Number(process.env.PORT || 4173)
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

const server = createServer(async (request, response) => {
  const rawPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname)
  const normalised = path.posix.normalize(rawPath).replace(/^\/+/, '')
  let target = path.join(root, normalised)
  if (rawPath.endsWith('/')) target = path.join(target, 'index.html')
  else if (!path.extname(target)) target = path.join(target, 'index.html')

  if (!target.startsWith(root) || !existsSync(target)) {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    createReadStream(path.join(root, '404.html')).pipe(response)
    return
  }

  const info = await stat(target)
  if (info.isDirectory()) target = path.join(target, 'index.html')
  response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(target)] || 'application/octet-stream' })
  createReadStream(target).pipe(response)
})

server.listen(port, () => console.log(`Preview server listening on http://localhost:${port}`))
