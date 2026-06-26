import React, { useState } from 'react'
import { motion } from 'framer-motion'

// Editable Dashboard with Draggable Widgets
export default function Dashboard() {
  const [widgets, setWidgets] = useState([
    { id: 1, type: 'thumbnails', x: 0, y: 0, w: 8, h: 6 },
    { id: 2, type: 'info', x: 8, y: 0, w: 4, h: 3 },
    { id: 3, type: 'toolbar', x: 0, y: 6, w: 12, h: 1 },
    { id: 4, type: 'status', x: 0, y: 7, w: 12, h: 1 }
  ])
  
  const [editMode, setEditMode] = useState(false)

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(12, 1fr)',
      gridTemplateRows: 'repeat(8, 1fr)',
      gap: '1rem',
      padding: '1rem',
      minHeight: '100vh',
      background: '#000',
      color: '#fff'
    }}>
      {widgets.map(widget => (
        <Widget key={widget.id} widget={widget} editMode={editMode} />
      ))}
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

function Widget({ widget, editMode }) {
  return (
    <motion.div
      style={{
        gridColumn: `${widget.x + 1} / span ${widget.w}`,
        gridRow: `${widget.y + 1} / span ${widget.h}`,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        position: 'relative'
      }}
      drag={editMode}
    >
      {widget.type === 'thumbnails' && <ThumbnailGrid />}
      {widget.type === 'info' && <div style={{ padding: '1rem' }}>Info Panel</div>}
      {widget.type === 'toolbar' && <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0 1rem', height: '100%' }}>
        <button style={{ background: '#00f5ff', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>Action</button>
      </div>}
      {widget.type === 'status' && <div style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#8a8aa0' }}>Ready</div>}
    </motion.div>
  )
}

function ThumbnailGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem', padding: '1rem', maxHeight: '100%', overflow: 'hidden' }}>
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{ background: '#12121a', paddingBottom: '100%', borderRadius: '4px' }} />
      ))}
    </div>
  )
}
