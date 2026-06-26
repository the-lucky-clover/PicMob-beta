import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '../App'

// Glassmorphic Box component
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

// Animated Counter component
const AnimatedCounter = ({ value, label, delay }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime = null
    const duration = 2000
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / duration
      setCount(Math.floor(value * Math.min(progress, 1)))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value])
  
  return (
    <GlassmorphicBox delay={delay} style={{ textAlign: 'center', padding: '1.5rem' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
          {count}+
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {label}
        </div>
      </motion.div>
    </GlassmorphicBox>
  )
}

// Feature Card
const FeatureCard = ({ icon, title, description, delay }) => (
  <GlassmorphicBox delay={delay} style={{ textAlign: 'center', cursor: 'pointer' }}>
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0 8px 40px rgba(0, 245, 255, 0.3)' }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {description}
      </p>
    </motion.div>
  </GlassmorphicBox>
)

// Hero Section
const HeroSection = () => (
  <section style={{
    padding: '8rem 1rem 4rem',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    {/* Background grid */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px'
    }} />
    
    <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
      <GlassmorphicBox delay={0.1}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: '4rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #00f5ff, #ff00ff, #ffff00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1
          }}
        >
          Share Your World
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            fontSize: '1.25rem',
            color: '#8a8aa0',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            lineHeight: 1.6
          }}
        >
          PicMob is a cyberpunk-inspired photo sharing platform with 3D skeuomorphic glassmorphic UI. 
          Share your moments with the world and discover amazing content.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <GlassmorphicBox delay={0.5} animate={false}>
            <motion.a
              href="/signup"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #00f5ff, #00c4d4)',
                color: '#0a0a0f',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 245, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.a>
          </GlassmorphicBox>
          
          <GlassmorphicBox delay={0.6} animate={false}>
            <motion.a
              href="#features"
              style={{
                display: 'inline-block',
                background: 'transparent',
                color: 'var(--text-secondary)',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 500,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              whileHover={{ scale: 1.05, color: 'var(--primary)' }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </GlassmorphicBox>
        </motion.div>
      </GlassmorphicBox>
    </div>
  </section>
)

// Features Section
const FeaturesSection = () => (
  <section id="features" style={{ padding: '6rem 1rem', background: '#12121a' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <GlassmorphicBox delay={0.1}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '3rem'
          }}
        >
          Why Choose PicMob?
        </motion.h2>
      </GlassmorphicBox>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        <FeatureCard
          icon="📸"
          title="High-Quality Sharing"
          description="Upload and share your photos in stunning quality with advanced compression and optimization."
          delay={0.3}
        />
        <FeatureCard
          icon="🌍"
          title="Global Community"
          description="Connect with photographers and creators from around the world."
          delay={0.4}
        />
        <FeatureCard
          icon="🔒"
          title="Privacy First"
          description="Your privacy matters with powerful privacy settings and encryption."
          delay={0.5}
        />
        <FeatureCard
          icon="⚡"
          title="Lightning Fast"
          description="Built on Cloudflare's global network for instant performance."
          delay={0.6}
        />
        <FeatureCard
          icon="📱"
          title="Cross-Platform"
          description="Access your photos anywhere on iOS, macOS, Windows, and web."
          delay={0.7}
        />
        <FeatureCard
          icon="🎨"
          title="Creative Tools"
          description="Enhance your photos with AI-powered editing tools."
          delay={0.8}
        />
      </div>
    </div>
  </section>
)

// Social Proof Section
const SocialProofSection = () => (
  <section id="social-proof" style={{ padding: '6rem 1rem', background: '#0a0a0f' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <GlassmorphicBox delay={0.1}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '1rem'
          }}
        >
          Trusted by Photographers Worldwide
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            textAlign: 'center',
            color: '#8a8aa0',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}
        >
          Join thousands of creators sharing their world on PicMob
        </motion.p>
      </GlassmorphicBox>
      
      {/* Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        <AnimatedCounter value={50000} label="Active Users" delay={0.3} />
        <AnimatedCounter value={250000} label="Photos Shared" delay={0.4} />
        <AnimatedCounter value={50} label="Countries" delay={0.5} />
        <AnimatedCounter value={4.9} label="App Store Rating" delay={0.6} />
      </div>
      
      {/* Testimonials Carousel */}
      <GlassmorphicBox delay={0.7}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
          <p style={{ fontSize: '1.125rem', fontStyle: 'italic', marginBottom: '1rem' }}>
            "PicMob has transformed how I share my photography. The cyberpunk UI is unlike anything else!"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00f5ff, #ff00ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>U</div>
            <div>
              <div style={{ fontWeight: 600 }}>Username</div>
              <div style={{ fontSize: '0.875rem', color: '#8a8aa0' }}>Photographer</div>
            </div>
          </div>
        </div>
      </GlassmorphicBox>
    </div>
  </section>
)

// Contact Section
const ContactSection = () => (
  <section id="contact" style={{ padding: '6rem 1rem', background: '#12121a' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <GlassmorphicBox>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
          Get in Touch
        </motion.h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ fontWeight: 500 }}>Name</label>
              <input
                type="text"
                id="name"
                required
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(10, 10, 15, 0.5)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ fontWeight: 500 }}>Email</label>
              <input
                type="email"
                id="email"
                required
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(10, 10, 15, 0.5)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="subject" style={{ fontWeight: 500 }}>Subject</label>
            <input
              type="text"
              id="subject"
              required
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(10, 10, 15, 0.5)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="message" style={{ fontWeight: 500 }}>Message</label>
            <textarea
              id="message"
              rows="5"
              required
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(10, 10, 15, 0.5)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
          
          <motion.button
            type="submit"
            style={{
              padding: '1rem 2rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #00f5ff, #ff00ff)',
              color: '#0a0a0f',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 245, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </motion.button>
        </form>
      </GlassmorphicBox>
    </div>
  </section>
)

// Footer
const Footer = () => (
  <footer style={{
    padding: '3rem 1rem',
    background: '#0a0a0f',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>
            PicMob
          </h4>
          <p style={{ color: '#8a8aa0', fontSize: '0.875rem' }}>
            Share your world with the PicMob community.
          </p>
        </div>
        
        <div>
          <h5 style={{ fontWeight: 600, marginBottom: '1rem' }}>Product</h5>
          <ul style={{ list: 'none', padding: 0, margin: 0, color: '#8a8aa0' }}>
            <li style={{ marginBottom: '0.5rem' }}><a href="#features" style={{ color: '#8a8aa0' }}>Features</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="#pricing" style={{ color: '#8a8aa0' }}>Pricing</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="/u/username" style={{ color: '#8a8aa0' }}>Profiles</a></li>
          </ul>
        </div>
        
        <div>
          <h5 style={{ fontWeight: 600, marginBottom: '1rem' }}>Company</h5>
          <ul style={{ list: 'none', padding: 0, margin: 0, color: '#8a8aa0' }}>
            <li style={{ marginBottom: '0.5rem' }}><a href="#about" style={{ color: '#8a8aa0' }}>About</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="#contact" style={{ color: '#8a8aa0' }}>Contact</a></li>
            <li style={{ marginBottom: '0.5rem' }}><a href="#privacy" style={{ color: '#8a8aa0' }}>Privacy</a></li>
          </ul>
        </div>
        
        <div>
          <h5 style={{ fontWeight: 600, marginBottom: '1rem' }}>Connect</h5>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: '#8a8aa0' }}>Twitter</a>
            <a href="#" style={{ color: '#8a8aa0' }}>Instagram</a>
            <a href="#" style={{ color: '#8a8aa0' }}>YouTube</a>
          </div>
        </div>
      </div>
      
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        color: '#666'
      }}>
        <p>&copy; 2026 PicMob. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

// HomePage
export default function HomePage() {
  return (
    <div style={{ background: '#0a0a0f', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SocialProofSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}