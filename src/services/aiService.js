/**
 * PicMob AI Services - Workers AI Integration
 * Provides ML/DL capabilities for image processing and analysis
 */

import { AI } from '@cloudflare/ai'

// Initialize AI client
const ai = new AI({
  account_id: 'YOUR_ACCOUNT_ID', // Will be set from environment
})

// AI Model endpoints
const MODELS = {
  // Image enhancement models
  ESRGAN: '@cf/tencent/arcane-gan-esrgan',
  REAL_ESRGAN: '@cf/falliscool/real-esrgan',
  
  // Image analysis models
  CLIP_INTERROGATION: '@cf/condees/clip-interrogation',
  BLIP_IMAGE_CAPTIONING: '@cf/blip/blip-image-captioning',
  
  // Object detection
  YOLO_CROWD: '@cf/facebook/yolo-crowd-v2',
  
  // Face analysis
  FACE_RECOGNITION: '@cf/microsoft/resnet50',
  
  // Colorization
  DEPICT_BOT: '@cf/depictbot/depictbot-colorization',
  
  // Inpainting for object removal
  STABLE_DIFFUSION_INPAINTING: '@cf/stability-ai/stable-diffusion-inpainting'
}

// Upscale image using ESRGAN
export async function upscaleImage(imageBuffer, scaleFactor = 4) {
  try {
    const response = await ai.run(MODELS.ESRGAN, {
      inputs: {
        image: imageBuffer,
        scale: scaleFactor
      }
    })
    return response
  } catch (error) {
    console.error('Upscaling failed:', error)
    throw error
  }
}

// Generate image caption and tags
export async function analyzeImage(imageBuffer) {
  try {
    // Get image caption
    const captionResponse = await ai.run(MODELS.BLIP_IMAGE_CAPTIONING, {
      inputs: {
        image: imageBuffer
      }
    })
    
    // Get CLIP interrogation for tags
    const tagsResponse = await ai.run(MODELS.CLIP_INTERROGATION, {
      inputs: {
        image: imageBuffer
      }
    })
    
    return {
      caption: captionResponse.caption || captionResponse,
      tags: tagsResponse.generations?.[0]?.text || '',
      style: tagsResponse.generations?.[0]?.style || ''
    }
  } catch (error) {
    console.error('Image analysis failed:', error)
    throw error
  }
}

// Detect objects in image
export async function detectObjects(imageBuffer) {
  try {
    const response = await ai.run(MODELS.YOLO_CROWD, {
      inputs: {
        image: imageBuffer
      }
    })
    return response
  } catch (error) {
    console.error('Object detection failed:', error)
    throw error
  }
}

// Remove object from image (inpainting)
export async function removeObject(imageBuffer, maskBuffer) {
  try {
    const response = await ai.run(MODELS.STABLE_DIFFUSION_INPAINTING, {
      inputs: {
        image: imageBuffer,
        mask: maskBuffer,
        prompt: ''
      }
    })
    return response
  } catch (error) {
    console.error('Object removal failed:', error)
    throw error
  }
}

// Colorize image
export async function colorizeImage(imageBuffer) {
  try {
    const response = await ai.run(MODELS.DEPICT_BOT, {
      inputs: {
        image: imageBuffer
      }
    })
    return response
  } catch (error) {
    console.error('Colorization failed:', error)
    throw error
  }
}

// Batch process images for auto-tagging
export async function batchProcessImages(images) {
  const results = []
  for (const image of images) {
    try {
      const analysis = await analyzeImage(image.buffer)
      results.push({
        id: image.id,
        ...analysis
      })
    } catch (error) {
      console.error(`Failed to process image ${image.id}:`, error)
      results.push({ id: image.id, error: error.message })
    }
  }
  return results
}

export default {
  upscaleImage,
  analyzeImage,
  detectObjects,
  removeObject,
  colorizeImage,
  batchProcessImages
}