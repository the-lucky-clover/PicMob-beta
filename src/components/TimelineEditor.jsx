import React, { useState } from 'react'
import { motion } from 'framer-motion'

// Timeline-based editing component with simple light controls
export const TimelineEditor = ({ media, onEdit }) => {
  const [tracks] = useState([
    { id: 1, type: 'video', name: 'Video', visible: true },
    { id: 2, type: 'audio', name: 'Audio', visible: true },
    { id: 3, type: 'annotations', name: 'Annotations', visible: false }
  ])
  
  const [trimStart] = useState(0)
  const [trimEnd] = useState(100)
  
  const adjustLight = (adjustment) => {
    onEdit({ type: 'light', adjustment })
  }
  
  return (
    <div className="timeline-editor">
      <div className="tracks-container">
        {tracks.map(track => (
          <div key={track.id} className="track">
            <div className="track-header">
              <span>{track.name}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="light-controls">
        <button onClick={() => adjustLight('brighten')}>Brighten</button>
        <button onClick={() => adjustLight('darken')}>Darken</button>
        <button onClick={() => adjustLight('contrast')}>Contrast</button>
      </div>
    </div>
  )
}
