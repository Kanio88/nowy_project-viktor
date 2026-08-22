import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const manifest = JSON.parse(await readFile(path.join(dist, 'build-manifest.json'), 'utf8'))
const host = 'https://every-day-care.com'
const failures = []
const titles = new Set()
const descriptions = new Set()

for (const route of manifest.routes) {
  const directory = route.path === '/' ? dist : path.join(dist, route.path.slice(1))
  const html = await readFile(path.join(directory, 'index.html'), 'utf8')
  const expectedUrl = route.path === '/' ? `${host}/` : `${host}${route.path}/`
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
  const description = html.match(/<meta name="description" content="([^"]+)" \/>/)?.[1]
  const canonical = html.match(/<link rel="canonical" href="([^"]+)" \/>/)?.[1]
  const h1 = html.match(/<h1>([^<]+)<\/h1>/)?.[1]
  if (!title) failures.push(`${route.path}: missing title`)
  if (!description) failures.push(`${route.path}: missing description`)
  if (!canonical || canonical !== expectedUrl) failures.push(`${route.path}: incorrect canonical`)
  if (!h1) failures.push(`${route.path}: missing H1`)
  if (title) titles.add(title)
  if (description) descriptions.add(description)
}

if (titles.size !== manifest.routes.length) failures.push('Page titles are not unique across all routes')
if (descriptions.size !== manifest.routes.length) failures.push('Meta descriptions are not unique across all routes')

const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8')
const notFound = await readFile(path.join(dist, '404.html'), 'utf8')
const redirects = await readFile(path.join(dist, '_redirects'), 'utf8')
if (sitemap.includes('www.every-day-care.com')) failures.push('Sitemap still includes the www host')
if (!robots.includes(`${host}/sitemap.xml`)) failures.push('robots.txt has the wrong sitemap URL')
if (!notFound.includes('noindex,follow')) failures.push('404 page must be noindex')
if (redirects.includes('/* /index.html 200')) failures.push('SPA catch-all would prevent true 404 responses')

if (failures.length) {
  console.error('Static-site verification failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`Verified ${manifest.routes.length} pre-rendered routes.`)
console.log('Titles, descriptions, canonicals, H1s, sitemap, robots, and 404 controls passed.')
