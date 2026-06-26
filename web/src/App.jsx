import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'

// Cyberpunk theme constants
const theme = {
  colors: {
    primary: '#00f5ff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    success: '#00ff88',
    background: '#0a0a0f',
    surface: '#12121a',
    surfaceLight: '#1e1e2a',
    border: '#2a2a3a',
    textPrimary: '#f0f0ff',
    textSecondary: '#8a8aa0'
  }
}

// Global styles injection
const injectGlobalStyles = () => {
  const globalStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary: ${theme.colors.primary};
      --secondary: ${theme.colors.secondary};
      --accent: ${theme.colors.accent};
      --background: ${theme.colors.background};
      --surface: ${theme.colors.surface};
      --surface-light: ${theme.colors.surfaceLight};
      --border: ${theme.colors.border};
      --text-primary: ${theme.colors.textPrimary};
      --text-secondary: ${theme.colors.textSecondary};
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--background);
      color: var(--text-primary);
      overflow-x: hidden;
      line-height: 1.6;
    }
    ::selection { background: var(--primary); color: var(--background); }
  `
  const styleSheet = document.createElement('style')
  styleSheet.textContent = globalStyles
  if (!document.head.contains(styleSheet)) {
    document.head.appendChild(styleSheet)
  }
}

injectGlobalStyles()

// Glassmorphic Box
const GlassmorphicBox = ({ children, className = '', animate = true, delay = 0, style = {}, onClick = null }) => {
  const box = (
    <div className={className} style={{
      background: 'rgba(18, 18, 26, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 245, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      padding: '2rem',
      ...style
    }} onClick={onClick}>
      {children}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay, type: 'spring', stiffness: 100, damping: 20 }}
      >
        {box}
      </motion.div>
    )
  }
  return box
}

// Pulse Effect
const PulseEffect = ({ children, intensity = 'normal' }) => {
  const pulseIntensity = {
    normal: 'rgba(0, 245, 255, 0.3)',
    strong: 'rgba(0, 245, 255, 0.5)'
  }
  
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 20px ${pulseIntensity[intensity]}`,
          `0 0 40px ${pulseIntensity[intensity]}`,
          `0 0 20px ${pulseIntensity[intensity]}`
        ]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

// Shimmer overlay component
const ShimmerOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <style>
      {`
        .shimmer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.3), transparent);
          animation: shimmer 3s infinite;
          pointer-events: none;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}
    </style>
  </motion.div>
)

// Floating Capsule Navbar
const Navbar = () => {
  const [shimmerKey, setShimmerKey] = useState(0)
  const [pulseIntensity, setPulseIntensity] = useState('normal')

  // Intermittent timer for shimmer (10-30 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setShimmerKey(prev => prev + 1)
      setPulseIntensity(Math.random() > 0.7 ? 'strong' : 'normal')
    }, 10000 + Math.random() * 20000) // 10-30 seconds
    
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.nav
      style={{
        position: 'sticky',
        top: '1rem',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        margin: '0 1rem'
      }}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1.5rem',
          background: 'rgba(18, 18, 26, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          boxShadow: '0 8px 32px rgba(0, 245, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          maxWidth: '1200px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Shimmer overlay */}
        <motion.div
          key={shimmerKey}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.4), transparent)',
            pointerEvents: 'none'
          }}
        />
        
        {/* Logo on left */}
        <motion.a
          href="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--primary)',
            textDecoration: 'none',
            fontFamily: 'Orbitron, monospace',
            position: 'relative',
            zIndex: 1
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          PicMob
        </motion.a>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <motion.a
            href="#features"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
            whileHover={{ color: 'var(--primary)' }}
          >
            Features
          </motion.a>
          <motion.a
            href="#social-proof"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
            whileHover={{ color: 'var(--primary)' }}
          >
            Social Proof
          </motion.a>
          <motion.a
            href="/u/username"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
            whileHover={{ color: 'var(--primary)' }}
          >
            Profiles
          </motion.a>
          
          {/* CTA Button with pulse effect */}
          <PulseEffect intensity={pulseIntensity}>
            <motion.a
              href="/signin"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: 'var(--background)',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.a>
          </PulseEffect>
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