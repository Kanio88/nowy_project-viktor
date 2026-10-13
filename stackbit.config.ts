import { defineStackbitConfig, getLocalizedFieldForLocale } from '@stackbit/types'
import { GitContentSource } from '@stackbit/cms-git'

/**
 * Content model for the Everyday Care Plus site.
 *
 * Content lives in `content/` as JSON and is rendered by
 * `scripts/build-static-site.mjs`. Document `type` values map to model names.
 */

const sectionModel = {
  name: 'section',
  type: 'object',
  label: 'Section',
  labelField: 'heading',
  fields: [
    { name: 'heading', type: 'string', label: 'Heading', required: true },
    { name: 'body', type: 'markdown', label: 'Body', required: true },
  ],
}

const pageModel = {
  name: 'page',
  type: 'page',
  label: 'Page',
  labelField: 'title',
  filePath: 'content/pages/{slug}.json',
  hideContent: true,
  fields: [
    { name: 'pageId', type: 'string', label: 'Page ID', hidden: true },
    { name: 'order', type: 'number', label: 'Sort order', group: 'advanced' },
    {
      name: 'urlPath',
      type: 'string',
      label: 'URL path',
      required: true,
      description: 'Live path for this page, e.g. /services/dementia-care',
      group: 'advanced',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Browser / search title',
      required: true,
      description: 'Shown in search results and the browser tab. Keep it unique.',
    },
    {
      name: 'description',
      type: 'text',
      label: 'Meta description',
      required: true,
      description: 'Search and social preview text. Keep it unique per page.',
    },
    { name: 'h1', type: 'string', label: 'Page heading', required: true },
    { name: 'intro', type: 'markdown', label: 'Introduction', required: true },
    { name: 'sections', type: 'list', label: 'Sections', items: { type: 'model', models: ['section'] } },
  ],
  fieldGroups: [{ name: 'advanced', label: 'Routing & ordering', icon: 'cog' }],
}

const siteConfigModel = {
  name: 'siteConfig',
  type: 'data',
  label: 'Site settings',
  singleInstance: true,
  filePath: 'content/site.json',
  fields: [
    { name: 'brandName', type: 'string', label: 'Brand name', required: true },
    { name: 'phoneDisplay', type: 'string', label: 'Phone number (as displayed)' },
    { name: 'schemaDescription', type: 'text', label: 'Business description (structured data)' },
    {
      name: 'business',
      type: 'object',
      label: 'Business details',
      fields: [
        { name: 'name', type: 'string', label: 'Legal name' },
        { name: 'url', type: 'string', label: 'Website URL' },
        { name: 'telephone', type: 'string', label: 'Phone (dialable, e.g. +447563011244)' },
        { name: 'email', type: 'string', label: 'Email' },
        {
          name: 'address',
          type: 'object',
          label: 'Address',
          fields: [
            { name: '@type', type: 'string', label: 'Schema type', hidden: true },
            { name: 'streetAddress', type: 'string', label: 'Street' },
            { name: 'addressLocality', type: 'string', label: 'Town / city' },
            { name: 'addressRegion', type: 'string', label: 'Region' },
            { name: 'postalCode', type: 'string', label: 'Postcode' },
            { name: 'addressCountry', type: 'string', label: 'Country' },
          ],
        },
        { name: 'areaServed', type: 'list', label: 'Areas served', items: { type: 'string' } },
      ],
    },
    {
      name: 'nav',
      type: 'list',
      label: 'Primary navigation',
      items: {
        type: 'object',
        labelField: 'label',
        fields: [
          { name: 'label', type: 'string', label: 'Label', required: true },
          { name: 'href', type: 'string', label: 'Link', required: true },
        ],
      },
    },
    {
      name: 'contactCta',
      type: 'object',
      label: 'Contact call to action',
      fields: [
        { name: 'heading', type: 'string', label: 'Heading' },
        { name: 'bookLabel', type: 'string', label: 'Booking link text' },
        { name: 'bookHref', type: 'string', label: 'Booking link' },
      ],
    },
    {
      name: 'footer',
      type: 'object',
      label: 'Footer',
      fields: [
        { name: 'legalLine', type: 'string', label: 'Legal line' },
        {
          name: 'links',
          type: 'list',
          label: 'Footer links',
          items: {
            type: 'object',
            labelField: 'label',
            fields: [
              { name: 'label', type: 'string', label: 'Label', required: true },
              { name: 'href', type: 'string', label: 'Link', required: true },
            ],
          },
        },
      ],
    },
    {
      name: 'notFound',
      type: 'object',
      label: '404 page',
      fields: [
        { name: 'title', type: 'string', label: 'Browser / search title' },
        { name: 'description', type: 'text', label: 'Meta description' },
        { name: 'h1', type: 'string', label: 'Heading' },
        { name: 'intro', type: 'string', label: 'Message' },
      ],
    },
    { name: 'social', type: 'list', label: 'Social profile URLs', items: { type: 'string' } },
    { name: 'ogImage', type: 'string', label: 'Social share image', group: 'technical' },
    { name: 'canonicalHost', type: 'string', label: 'Canonical host', group: 'technical' },
    { name: 'themeColor', type: 'string', label: 'Theme colour', group: 'technical' },
    { name: 'gtmId', type: 'string', label: 'Google Tag Manager ID', group: 'technical' },
    {
      name: 'assets',
      type: 'object',
      label: 'Built asset paths',
      description: 'Compiled bundle and stylesheet paths. Changing these can break the site.',
      group: 'technical',
      fields: [
        { name: 'module', type: 'string', label: 'JS module' },
        { name: 'stylesheets', type: 'list', label: 'Stylesheets', items: { type: 'string' } },
        { name: 'extraStylesheets', type: 'list', label: 'Extra stylesheets', items: { type: 'string' } },
        { name: 'deferScripts', type: 'list', label: 'Deferred scripts', items: { type: 'string' } },
      ],
    },
  ],
  fieldGroups: [{ name: 'technical', label: 'Technical', icon: 'cog' }],
}

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  nodeVersion: '20',
  devCommand: 'node ./scripts/visual-editor-dev.mjs --port {PORT}',
  experimental: {
    ssg: {
      name: 'custom',
      logPatterns: { up: ['Visual Editor dev server ready'] },
    },
  },
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['content'],
      models: [pageModel, sectionModel, siteConfigModel],
      assetsConfig: {
        referenceType: 'static',
        staticDir: 'images',
        uploadDir: 'uploads',
        publicPath: '/images',
      },
    }),
  ],
  // Pages declare their own live path, so the sitemap is built from `urlPath`
  // rather than inferred from the file name.
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter((model) => model.type === 'page').map((model) => model.name)
    return documents
      .filter((document) => pageModels.includes(document.modelName))
      .map((document) => {
        const urlPathValue = getLocalizedFieldForLocale(document.fields.urlPath)?.value
        if (!urlPathValue) return null
        const urlPath = `/${String(urlPathValue).replace(/^\/+/, '')}`
        const pageId = getLocalizedFieldForLocale(document.fields.pageId)?.value
        return {
          stableId: pageId ? String(pageId) : document.id,
          urlPath,
          document,
          isHomePage: urlPath === '/',
        }
      })
      .filter(Boolean)
  },
})
