import React, { useState } from 'react'
import { motion } from 'framer-motion'
import VirtualThumbnailGrid from './VirtualThumbnailGrid'

export default function Dashboard() {
  const [editMode, setEditMode] = useState(false)

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr',
      minHeight: '100vh',
      background: '#000',
      color: '#fff'
    }}>
      <div style={{ padding: '1rem' }}>
        <VirtualThumbnailGrid itemCount={100000} />
      </div>
      
      <button onClick={() => setEditMode(!editMode)} style={{
        position: 'fixed', top: '1rem', right: '1rem', zIndex: 100,
        background: editMode ? '#00f5ff' : '#333',
        color: '#000',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px'
      }}>
        {editMode ? 'Lock' : 'Edit'}
      </button>
    </div>
  )
}
