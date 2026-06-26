import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

// VIRTUAL LAZY LOADING THUMBNAIL GRID
export default function VirtualThumbnailGrid({ itemCount = 100000 }) {
  const containerRef = useRef()
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 })
  
  // Smart cache
  const cache = useRef(new Map())
  const preloadCount = 20
  
  // Calculate visible range based on scroll
  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    
    const scrollTop = container.scrollTop
    const height = container.clientHeight
    const rowHeight = 160 // thumbnail height
    
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - preloadCount)
    const end = Math.min(
      itemCount,
      Math.ceil((scrollTop + height) / rowHeight) + preloadCount
    )
    
    setVisibleRange({ start, end })
  }, [itemCount])
  
  // Generate thumbnails on-demand
  const getThumbnail = useCallback((index) => {
    if (cache.current.has(index)) {
      return cache.current.get(index)
    }
    
    // Simulate thumbnail generation
    const thumbnail = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
        <rect width="150" height="150" fill="#12121a"/>
        <text x="75" y="75" font-family="monospace" font-size="12" fill="#8a8aa0" text-anchor="middle">IMG ${index}</text>
      </svg>
    `)}`
    
    cache.current.set(index, thumbnail)
    return thumbnail
  }, [])
  
  // Generate visible thumbnails
  const thumbnails = []
  for (let i = visibleRange.start; i < visibleRange.end; i++) {
    thumbnails.push(
      <Thumbnail key={i} index={i} src={getThumbnail(i)} />
    )
  }
  
  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: '100%',
        overflow: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '0.5rem',
        padding: '1rem'
      }}
    >
      {thumbnails}
    </div>
  )
}

function Thumbnail({ index, src }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: '#12121a',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      <img 
        src={src} 
        alt={`Photo ${index}`}
        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
        loading="lazy"
      />
      <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#8a8aa0' }}>
        Photo {index}
      </div>
    </motion.div>
  )
}
