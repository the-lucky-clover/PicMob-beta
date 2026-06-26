import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Admin Dashboard for Telemetry Analytics
const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/telemetry/aggregate')
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', background: '#0a0a0f', color: 'white', minHeight: '100vh' }}>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        PicMob Admin Dashboard
      </motion.h1>
      
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        Telemetry Analytics & Model Performance
      </motion.p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {metrics && Object.entries(metrics).map(([modelType, data]) => (
          <motion.div
            key={modelType}
            style={{
              background: 'rgba(18, 18, 26, 0.6)',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 style={{ color: '#00f5ff', marginBottom: '1rem' }}>{modelType}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ color: '#8a8aa0', fontSize: '0.875rem' }}>Avg Loss</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.avg_loss?.toFixed(4)}</div>
              </div>
              <div>
                <div style={{ color: '#8a8aa0', fontSize: '0.875rem' }}>Accuracy</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.avg_accuracy?.toFixed(2)}%</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ color: '#8a8aa0', fontSize: '0.875rem' }}>Samples (24h)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.sample_count}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
