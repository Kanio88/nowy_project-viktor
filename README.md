# Nowy Project — Editable React + Vite site

This repository is restructured so you can edit pages directly with plain React + Vite and no proprietary tooling.

Quick guide

- Edit pages: src/pages/*.jsx (Home.jsx, Blog.jsx, Article.jsx)
- Add a new page: create src/pages/NewPage.jsx, import it into src/App.jsx and add a <Route path="/new-page" element={<NewPage/>} />
- Layout: src/components/Layout.jsx (header, nav, footer)
- Run locally: 
  1. npm install
  2. npm run dev
- Build: npm run build
- Netlify: netlify.toml present and public/_redirects contains SPA redirect. Point Netlify to build command `npm run build` and publish `dist`.

Notes

- All homepage content now lives in src/pages/Home.jsx (editable).
- Articles: src/pages/Article.jsx is a simple template; paste full article JSX or extend to load Markdown files.
- To publish to GitHub: create a repo and push this branch, or use `gh repo create`.

ZIP

A zip of the project has been created in the repository root as `nowy_project-viktor-source.zip`.
