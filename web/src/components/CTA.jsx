import React from 'react'
import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section style={{ padding: '8rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #000 0%, #0a0a0f 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>Ready to transform your photos?</h2>
        <p style={{ color: '#8a8aa0', marginBottom: '2rem' }}>Join thousands of creators already using PicMob</p>
        <motion.a href="/signup" style={{ background: 'linear-gradient(135deg, #00f5ff, #ff00ff)', color: '#000', padding: '1rem 3rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 700 }}>Get Started Free</motion.a>
      </motion.div>
    </section>
  )
}
