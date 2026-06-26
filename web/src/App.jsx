import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Features from './components/Features'
import SocialProof from './components/SocialProof'
import CTA from './components/CTA'
import Footer from './components/Footer'

// Global styles
const injectGlobalStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary: #00f5ff;
      --secondary: #ff00ff;
      --accent: #ffff00;
      --background: #000000;
      --surface: #0a0a0f;
      --text-primary: #ffffff;
      --text-secondary: #a0a0b0;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--background);
      color: var(--text-primary);
      overflow-x: hidden;
    }
    ::selection { background: var(--primary); color: #000; }
  `
  document.head.appendChild(style)
}
injectGlobalStyles()

// Premium Navbar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem 2rem',
        background: scrolled ? 'rgba(10, 10, 15, 0.95)' : 'transparent',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', width: '100%' }}>
        <motion.a href="/" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none', fontFamily: 'Orbitron, monospace', letterSpacing: '2px' }}>
          PICMOB
        </motion.a>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>Features</a>
            <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Pricing</a>
            <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>About</a>
          </nav>
          <motion.a href="/signin" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#000', padding: '0.75rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 700, transition: 'transform 0.2s' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Get Started
          </motion.a>
        </div>
      </div>
    </motion.nav>
  )
}

// Main App
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
            <Hero />
            <Features />
            <SocialProof />
            <CTA />
            <Footer />
          </main>
        } />
      </Routes>
    </Router>
  )
}

export default App
