import React from 'react'
import { motion } from 'framer-motion'

// DISRUPTIVE HERO SECTION
export default function Hero() {
  return (
    <section style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #000 0%, #0a0a0f 100%)'
    }}>
      {/* GRID BACKGROUND */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px'
      }} />

      {/* FLOATING PARTICLES */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: '#00f5ff',
            borderRadius: '50%',
            opacity: Math.random() * 0.8 + 0.2
          }}
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 10 + Math.random() * 20, repeat: Infinity }}
        />
      ))}

      {/* HERO CONTENT */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        maxWidth: '1200px',
        padding: '0 2rem',
        zIndex: 10
      }}>
        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.5rem',
            background: 'rgba(0, 245, 255, 0.1)',
            border: '1px solid rgba(0, 245, 255, 0.3)',
            borderRadius: '50px',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#00f5ff'
          }}
        >
          <span style={{ width: '8px', height: '8px', background: '#00f5ff', borderRadius: '50%' }} />
          AI-POWERED PHOTO MAGIC
        </motion.div>

        {/* HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            fontWeight: 900,
            lineHeight: 0.9,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #fff 0%, #00f5ff 50%, #ff00ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          YOUR PHOTOS.<br />
          <span style={{ color: '#ff00ff' }}>REDESIGNED.</span>
        </motion.h1>

        {/* SUBHEAD */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(1.25rem, 3vw, 2rem)',
            color: '#a0a0b0',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: 1.6
          }}
        >
          PicMob is the first AI photo studio that makes your images look like they were shot by a professional. 
          <span style={{ color: '#00f5ff' }}> No filters. No presets. Just pure AI magic.</span>
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.a
            href="/signup"
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #00c4cc)',
              color: '#000',
              padding: '1.25rem 3rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.125rem',
              transition: 'transform 0.2s'
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 245, 255, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            Start Free Trial
          </motion.a>
          <motion.a
            href="#demo"
            style={{
              background: 'transparent',
              color: '#fff',
              padding: '1.25rem 2rem',
              border: '2px solid rgba(255,255,255,0.1)',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.125rem'
            }}
            whileHover={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(0, 245, 255, 0.5)' }}
          >
            Watch Demo
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
