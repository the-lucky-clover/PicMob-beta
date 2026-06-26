import React, { useState } from 'react'
import { motion } from 'framer-motion'

// LAYOUT SYSTEM - Grid, List, Timeline, Map
export default function LayoutSystem({ photos, layout, onLayoutChange }) {
  const layouts = {
    grid: { columns: 8, rowHeight: 200, label: 'Grid View' },
    list: { columns: 1, rowHeight: 80, label: 'List View' },
    timeline: { columns: 12, rowHeight: 100, label: 'Timeline' },
    map: { columns: 4, rowHeight: 250, label: 'Map View' }
  }
  
  const currentLayout = layouts[layout] || layouts.grid
  
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Layout Selector */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.5rem',
        background: 'rgba(10, 10, 15, 0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {Object.entries(layouts).map(([key, config]) => (
          <motion.button
            key={key}
            onClick={() => onLayoutChange(key)}
            style={{
              padding: '0.5rem 1rem',
              background: layout === key ? '#00f5ff' : 'transparent',
              color: layout === key ? '#000' : '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
            whileHover={{ scale: 1.05 }}
          >
            {config.label}
          </motion.button>
        ))}
      </div>
      
      {/* Layout Display */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'grid',
        gridTemplateColumns: `repeat(${currentLayout.columns}, 1fr)`,
        gap: '0.5rem',
        padding: '1rem'
      }}>
        {photos.map((photo, i) => (
          <PhotoTile key={photo.id} photo={photo} layout={layout} />
        ))}
      </div>
    </div>
  )
}

function PhotoTile({ photo, layout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
      style={{
        background: '#12121a',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <img 
        src={photo.thumbnail} 
        alt={photo.name}
        style={{ 
          width: '100%', 
          height: layout === 'list' ? '60px' : '120px',
          objectFit: 'cover'
        }} 
      />
      {layout === 'list' && (
        <div style={{ 
          position: 'absolute', 
          right: '0.5rem', 
          top: '50%', 
          transform: 'translateY(-50%)',
          fontSize: '0.75rem',
          color: '#8a8aa0'
        }}>
          {photo.name}
        </div>
      )}
    </motion.div>
  )
}
