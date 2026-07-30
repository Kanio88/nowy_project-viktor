import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div>
      <h1>Welcome to the Nowy Project</h1>
      <p>This homepage is fully editable in <code>src/pages/Home.jsx</code>. Change text, sections, or links here without touching compiled files.</p>

      <section>
        <h2>Latest</h2>
        <ul>
          <li><Link to="/blog">Visit the Blog</Link></li>
          <li><Link to="/adhd-support-article">Rethinking ADHD Support (example article)</Link></li>
        </ul>
      </section>

      <section>
        <h2>How to edit</h2>
        <ol>
          <li>Open <code>src/pages/Home.jsx</code></li>
          <li>Edit the JSX text and save</li>
          <li>Run <code>npm run dev</code> to preview locally</li>
        </ol>
      </section>
    </div>
  )
}
