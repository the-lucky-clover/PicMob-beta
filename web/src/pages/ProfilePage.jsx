import React from 'react'
import { useParams } from 'react-router-dom'
import { Navbar } from '../App'

// Profile Page - Instagram-inspired with 3D glassmorphic design
export default function ProfilePage() {
  const { username } = useParams()
  
  return (
    <div style={{ background: '#0a0a0f', color: 'white', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h1 style={{ fontSize: '3rem', color: '#00f5ff' }}>@{username}</h1>
          <p style={{ color: '#8a8aa0', marginTop: '1rem' }}>
            This profile is private. Follow the user to see their photos.
          </p>
          <button style={{
            marginTop: '2rem',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #00f5ff, #ff00ff)',
            border: 'none',
            borderRadius: '8px',
            color: '#0a0a0f',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Send Message
          </button>
        </div>
      </main>
    </div>
  )
}
