import React from 'react'
import { motion } from 'framer-motion'

// PREMIUM FEATURES SECTION
export default function Features() {
  const features = [
    {
      title: 'AI-Powered Editing',
      desc: 'Professional-grade AI that transforms your photos instantly',
      icon: '🎨'
    },
    {
      title: 'One-Click Enhancement',
      desc: 'Make any photo look magazine-ready with a single tap',
      icon: '⚡'
    },
    {
      title: 'Style Transfer',
      desc: 'Apply any artistic style with unprecedented realism',
      icon: '🎭'
    }
  ]

  return (
    <section id="features" style={{
      padding: '10rem 2rem',
      background: 'linear-gradient(180deg, #000 0%, #0a0a0f 100%)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Why Photographers <span style={{ color: '#00f5ff' }}>Love</span> PicMob
          </h2>
          <p style={{ color: '#8a8aa0', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            The future of photo editing is here
          </p>
        </motion.div>

        {/* FEATURES GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: 'easeOut' }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                padding: '2rem',
                textAlign: 'center',
                transition: 'transform 0.3s'
              }}
              whileHover={{ transform: 'translateY(-10px)', background: 'rgba(0, 245, 255, 0.05)' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#8a8aa0', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
