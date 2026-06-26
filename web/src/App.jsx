import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

export const Navbar = () => {
  const [shimmerKey, setShimmerKey] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setShimmerKey(prev => prev + 1), 10000 + Math.random() * 20000)
    return () => clearInterval(timer)
  }, [])
  return (
    <motion.nav style={{ position: 'sticky', top: '1rem', zIndex: 100, display: 'flex', justifyContent: 'center', margin: '0 1rem' }}>
      <motion.div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.5rem', background: 'rgba(18, 18, 26, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '9999px', maxWidth: '1200px', width: '100%', position: 'relative' }} whileHover={{ scale: 1.02 }}>
        <motion.a href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00f5ff', textDecoration: 'none', fontFamily: 'Orbitron, monospace' }}>PicMob</motion.a>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <motion.a href="#features" style={{ color: '#8a8aa0', textDecoration: 'none' }}>Features</motion.a>
          <motion.a href="/signin" style={{ background: 'linear-gradient(135deg, #00f5ff, #ff00ff)', color: '#0a0a0f', padding: '0.5rem 1.25rem', borderRadius: '9999px', textDecoration: 'none', fontWeight: 600 }}>Sign In</motion.a>
        </div>
      </motion.div>
    </motion.nav>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/u/:username" element={<ProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App
