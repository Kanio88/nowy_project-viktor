import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Article from './pages/Article'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        {/* Example static article route (easy to add): */}
        <Route path="/adhd-support-article" element={<Article />} />
        {/* Dynamic article routes: create a page under /articles/:slug */}
        <Route path="/articles/:slug" element={<Article />} />
        {/* Add new pages by importing them and adding a Route here */}
      </Routes>
    </Layout>
  )
}
