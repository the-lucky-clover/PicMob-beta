/**
 * PicMob Telemetry Service - Sanitized & Anonymized Model Training
 * Collects opt-in telemetry for collective model improvement
 */

// Collect training metrics (sanitized)
export const collectTelemetry = async (metrics) => {
  const sanitized = {
    modelType: metrics.modelType,
    loss: metrics.loss,
    accuracy: metrics.accuracy,
    timestamp: Date.now(),
    deviceId: getDeviceId(), // Hashed, not identifiable
    version: APP_VERSION
  }
  
  try {
    await fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized)
    })
  } catch (error) {
    console.error('Telemetry failed:', error)
  }
}

// Generate anonymous device ID
const getDeviceId = () => {
  let id = localStorage.getItem('device_id')
  if (!id) {
    id = btoa(Math.random().toString() + Date.now().toString()).slice(0, 16)
    localStorage.setItem('device_id', id)
  }
  return id
}

// Aggregate telemetry endpoint
export const aggregateTelemetry = async () => {
  const response = await fetch('/api/telemetry/aggregate')
  return response.json()
}
