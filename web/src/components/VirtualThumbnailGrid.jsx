import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

// ERROR RECOVERY WITH GRACEFUL DEGRADATION
export default function VirtualThumbnailGrid({ itemCount = 100000 }) {
  const containerRef = useRef()
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 })
  const [errors, setErrors] = useState(new Set())
  
  const cache = useRef(new Map())
  const cacheOrder = useRef([])
  const maxCacheSize = 200
  const preloadCount = 30
  
  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    
    const scrollTop = container.scrollTop
    const height = container.clientHeight
    const rowHeight = 160
    
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - preloadCount)
    const end = Math.min(itemCount, Math.ceil((scrollTop + height) / rowHeight) + preloadCount)
    
    setVisibleRange({ start, end })
  }, [itemCount])
  
  const getThumbnail = useCallback((index) => {
    if (cache.current.has(index)) {
      const orderIndex = cacheOrder.current.indexOf(index)
      if (orderIndex > -1) cacheOrder.current.splice(orderIndex, 1)
      cacheOrder.current.push(index)
      return cache.current.get(index)
    }
    
    if (cache.current.size >= maxCacheSize) {
      const oldest = cacheOrder.current.shift()
      cache.current.delete(oldest)
    }
    
    const thumbnail = generateThumbnail(index)
    cache.current.set(index, thumbnail)
    cacheOrder.current.push(index)
    return thumbnail
  }, [])
  
  const handleError = (index) => {
    setErrors(prev => new Set(prev).add(index))
  }
  
  const generateThumbnail = (index) => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
        <rect width="150" height="150" fill="#12121a"/>
        <text x="75" y="75" font-family="monospace" font-size="12" fill="#8a8aa0" text-anchor="middle">IMG ${index}</text>
      </svg>
    `)}`
  }
  
  const thumbnails = []
  for (let i = visibleRange.start; i < visibleRange.end; i++) {
    thumbnails.push(
      <Thumbnail 
        key={i} 
        index={i} 
        src={getThumbnail(i)} 
        hasError={errors.has(i)}
        onError={() => handleError(i)}
      />
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

function Thumbnail({ index, src, hasError, onError }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: '#12121a',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {hasError ? (
        <div style={{ 
          width: '100%', 
          height: '120px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#0a0a0f',
          color: '#8a8aa0'
        }}>
          ⚠️ Corrupted
        </div>
      ) : (
        <img 
          src={src} 
          alt={`Photo ${index}`} 
          loading="lazy"
          onError={onError}
          style={{ width: '100%', height: '120px', objectFit: 'cover' }} 
        />
      )}
    </motion.div>
  )
}
