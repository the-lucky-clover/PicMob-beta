import React, { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import VirtualThumbnailGrid from './VirtualThumbnailGrid'
import ViewportControl from './ViewportControl'

// PHASE 1: CORE DASHBOARD
// Large viewport with grid layout
export default function Dashboard() {
  const [viewportMode, setViewportMode] = useState('center')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [widgets, setWidgets] = useState([
    { id: 'thumbnails', type: 'thumbnails', x: 0, y: 0, w: 8, h: 6 },
    { id: 'info', type: 'info', x: 8, y: 0, w: 4, h: 3 },
    { id: 'toolbar', type: 'toolbar', x: 0, y: 6, w: 12, h: 1 },
    { id: 'status', type: 'status', x: 0, y: 7, w: 12, h: 1 }
  ])

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: sidebarOpen ? '250px 1fr' : '50px 1fr',
      gridTemplateRows: 'auto 1fr auto',
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      transition: 'grid-template-columns 0.3s'
    }}>
      {/* Toolbar */}
      <motion.div 
        style={{ 
          gridColumn: '2 / -1',
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'transparent', border: 'none', color: '#00f5ff', cursor: 'pointer' }}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
          <ViewportControl onViewportChange={setViewportMode} />
        </div>
        
        <button 
          onClick={() => setEditMode(!editMode)}
          style={{ 
            background: editMode ? '#00f5ff' : '#333',
            color: '#000',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {editMode ? 'Lock Layout' : 'Edit Layout'}
        </button>
      </motion.div>

      {/* Sidebar */}
      <motion.div 
        style={{ 
          gridRow: '2',
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '1rem',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          overflow: 'auto'
        }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#00f5ff' }}>Navigation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button style={{ background: 'transparent', border: 'none', color: '#fff', textAlign: 'left' }}>Photos</button>
          <button style={{ background: 'transparent', border: 'none', color: '#fff', textAlign: 'left' }}>Videos</button>
          <button style={{ background: 'transparent', border: 'none', color: '#fff', textAlign: 'left' }}>Favorites</button>
        </div>
      </motion.div>

      {/* Main Viewport */}
      <motion.div 
        style={{ 
          gridRow: '2',
          overflow: 'auto',
          padding: '1rem'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Suspense fallback={<div style={{ color: '#00f5ff', textAlign: 'center', padding: '2rem' }}>Loading...</div>}>
          <VirtualThumbnailGrid itemCount={100000} viewportMode={viewportMode} />
        </Suspense>
      </motion.div>

      {/* Status Bar */}
      <motion.div 
        style={{ 
          gridColumn: '2 / -1',
          background: 'rgba(10, 10, 15, 0.95)',
          padding: '0.5rem 1rem',
          fontSize: '0.75rem',
          color: '#8a8aa0',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Ready • {widgets.length} widgets • {viewportMode} mode
      </motion.div>
    </div>
  )
}
