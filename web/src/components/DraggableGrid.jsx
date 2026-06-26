import React, { useState } from 'react'
import { motion } from 'framer-motion'

// IOS-LIKE DRAGGABLE GRID
export default function DraggableGrid({ items, onDragEnd, lockMode, onToggleLock }) {
  const [draggedItem, setDraggedItem] = useState(null)
  const [arrangedItems, setArrangedItems] = useState(items)
  
  const handleDragEnd = (event, info, item) => {
    if (lockMode) return
    
    const newItems = [...arrangedItems]
    const draggedIndex = newItems.findIndex(i => i.id === item.id)
    const targetIndex = Math.round(info.offset.x / 200) + draggedIndex
    
    if (draggedIndex !== targetIndex) {
      const [moved] = newItems.splice(draggedIndex, 1)
      newItems.splice(targetIndex, 0, moved)
      setArrangedItems(newItems)
      onDragEnd(newItems)
    }
    
    setDraggedItem(null)
  }
  
  return (
    <div style={{
      position: 'relative',
      padding: '1rem',
      background: 'rgba(10, 10, 15, 0.5)',
      borderRadius: '8px',
      border: '1px dashed rgba(0, 245, 255, 0.3)'
    }}>
      {/* Lock Indicator */}
      {lockMode && (
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: '#00f5ff',
          color: '#000',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          🔒 Locked
        </div>
      )}
      
      {/* Grid Items */}
      <motion.div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}
      >
        {arrangedItems.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            onDragEnd={handleDragEnd}
            isDragging={draggedItem?.id === item.id}
            setDraggedItem={setDraggedItem}
            lockMode={lockMode}
          />
        ))}
      </motion.div>
    </div>
  )
}

function DraggableItem({ item, onDragEnd, isDragging, setDraggedItem, lockMode }) {
  return (
    <motion.div
      layoutId={item.id}
      drag={ !lockMode }
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={() => setDraggedItem(item)}
      onDragEnd={(e, info) => onDragEnd(e, info, item)}
      style={{
        background: 'rgba(18, 18, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '1rem',
        cursor: lockMode ? 'default' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 1.05 : 1
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div style={{ fontSize: '0.875rem', color: '#8a8aa0', marginBottom: '0.5rem' }}>
        {item.type}
      </div>
      <div style={{ 
        height: '80px', 
        background: 'linear-gradient(135deg, #12121a, #0a0a0f)',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        📄 {item.type}
      </div>
    </motion.div>
  )
}
