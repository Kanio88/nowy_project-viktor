import React from 'react'
import { Link } from 'react-router-dom'

export default function Blog(){
  return (
    <div>
      <h1>Blog</h1>
      <p>Below are article links. Add new entries here, or render them dynamically from JSON/MD files later.</p>
      <ul>
        <li><Link to="/adhd-support-article">Rethinking ADHD Support</Link></li>
        <li><Link to="/articles/rethinking-adhd-support">Rethinking ADHD Support (articles/:slug)</Link></li>
      </ul>
    </div>
  )
}
