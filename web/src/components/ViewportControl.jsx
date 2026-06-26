import React, { useState } from 'react'
import { motion } from 'framer-motion'

// VIEWPORT OPTIONS - Center, Stretch, Fill, Actual Size
export default function ViewportControl({ onViewportChange }) {
  const [activeMode, setActiveMode] = useState('center')
  
  const modes = [
    { id: 'center', label: 'Center', desc: 'Photo centered, show full image' },
    { id: 'stretch', label: 'Stretch', desc: 'Fill window, may distort' },
    { id: 'fill', label: 'Fill', desc: 'Cover window, crop edges' },
    { id: 'actual', label: 'Actual', desc: '1:1 pixel mapping' }
  ]
  
  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      padding: '0.5rem',
      background: 'rgba(10, 10, 15, 0.9)',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)'
    }}>
      {modes.map(mode => (
        <motion.button
          key={mode.id}
          onClick={() => {
            setActiveMode(mode.id)
            onViewportChange(mode.id)
          }}
          style={{
            padding: '0.5rem 1rem',
            background: activeMode === mode.id ? '#00f5ff' : 'transparent',
            color: activeMode === mode.id ? '#000' : '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: activeMode === mode.id ? 600 : 400
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={mode.desc}
        >
          {mode.label}
        </motion.button>
      ))}
    </div>
  )
}
