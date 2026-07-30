import React from 'react'
import { Link } from 'react-router-dom'

export default function Layout({ children }){
  return (
    <div>
      <header>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:900,margin:'0 auto',padding:'0 1rem'}}>
          <div>
            <Link to="/" style={{fontWeight:700,color:'#111827',textDecoration:'none'}}>Nowy Project</Link>
          </div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/blog">Blog</Link>
          </nav>
        </div>
      </header>
      <main className="container">{children}</main>
      <footer>
        <div className="container">
          <p>© {new Date().getFullYear()} Nowy Project — editable React + Vite site</p>
        </div>
      </footer>
    </div>
  )
}
