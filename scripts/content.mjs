import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const contentDir = path.join(root, 'content')
export const pagesDir = path.join(contentDir, 'pages')

async function jsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const found = []
  for (const entry of entries) {
    const full = path.join(directory, entry.name)
    if (entry.isDirectory()) found.push(...(await jsonFiles(full)))
    else if (entry.name.endsWith('.json')) found.push(full)
  }
  return found
}

// Visual Editor identifies a Git CMS document by its repo-relative file path.
// The same value is emitted as data-sb-object-id so edits map back to the file.
const objectId = (file) => path.relative(root, file).split(path.sep).join('/')

export async function loadContent() {
  const site = JSON.parse(await readFile(path.join(contentDir, 'site.json'), 'utf8'))
  site.objectId = objectId(path.join(contentDir, 'site.json'))

  const files = await jsonFiles(pagesDir)
  const pages = await Promise.all(files.map(async (file) => ({
    ...JSON.parse(await readFile(file, 'utf8')),
    objectId: objectId(file),
  })))

  pages.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.urlPath.localeCompare(b.urlPath))
  return { site, pages }
}
