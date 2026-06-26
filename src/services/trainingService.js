/**
 * PicMob Training Service - Opt-in AI Training
 * OFF BY DEFAULT - User must explicitly consent
 */

// Training consent state
let trainingConsent = {
  image: false,
  video: false,
  audio: false,
  lastUpdated: null
}

// Check if training is allowed
export const isTrainingAllowed = (mediaType) => {
  return trainingConsent[mediaType] === true
}

// Request training consent
export const requestTrainingConsent = async (mediaType) => {
  const confirmed = window.confirm(
    `PicMob can improve its ${mediaType} editing by training on your photos/videos.\n\n` +
    `• Your data stays local (never leaves your device)\n` +
    `• Models improve for everyone\n` +
    `• You can opt-out anytime\n\n` +
    `Allow ${mediaType} training?`
  )
  
  if (confirmed) {
    trainingConsent[mediaType] = true
    trainingConsent.lastUpdated = new Date().toISOString()
    localStorage.setItem('picmob_training_consent', JSON.stringify(trainingConsent))
    return true
  }
  return false
}

// Get current consent state
export const getTrainingConsent = () => {
  const saved = localStorage.getItem('picmob_training_consent')
  if (saved) {
    trainingConsent = JSON.parse(saved)
  }
  return trainingConsent
}

// Revoke consent
export const revokeTrainingConsent = (mediaType) => {
  trainingConsent[mediaType] = false
  localStorage.setItem('picmob_training_consent', JSON.stringify(trainingConsent))
}
