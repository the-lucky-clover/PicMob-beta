import React from 'react'
import { motion } from 'framer-motion'

export default function SocialProof() {
  return (
    <section style={{ padding: '5rem 2rem', background: '#0a0a0f' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#00f5ff' }}>Trusted by 10,000+ creators</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
