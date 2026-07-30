import React from 'react'
import { useParams } from 'react-router-dom'

export default function Article(){
  const params = useParams()
  const slug = params.slug || 'adhd-support-article'

  // Simple place to paste full article HTML/JSX. You can expand this to load Markdown or fetch data.
  const articles = {
    'adhd-support-article': {
      title: 'Rethinking ADHD Support',
      content: (
        <>
          <p>This is an example article. Replace the JSX here with the full article text you want to publish.</p>
          <p>Paste paragraphs, headings, images, and links directly into the <code>content</code> field of this file, or make this component fetch article data based on the URL slug.</p>
        </>
      )
    },
    'rethinking-adhd-support': {
      title: 'Rethinking ADHD Support (alt slug)',
      content: (<p>Alternate article content can go here.</p>)
    }
  }

  const article = articles[slug] || { title: 'Article not found', content: <p>No content for {slug}</p> }

  return (
    <article>
      <h1>{article.title}</h1>
      <div>{article.content}</div>
      <p style={{marginTop: '2rem', fontStyle:'italic'}}>Edit this page at <code>src/pages/Article.jsx</code></p>
    </article>
  )
}
