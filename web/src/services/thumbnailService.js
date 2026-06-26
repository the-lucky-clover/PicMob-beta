// PARALLEL THUMBNAIL GENERATION SERVICE
class ThumbnailService {
  constructor() {
    this.workerCount = navigator.hardwareConcurrency || 4
    this.cache = new Map()
  }
  
  async generateThumbnails(paths) {
    const batches = this.chunkArray(paths, Math.ceil(paths.length / this.workerCount))
    const results = await Promise.all(batches.map(batch => this.processBatch(batch)))
    return results.flat()
  }
  
  async processBatch(paths) {
    return Promise.all(paths.map(path => this.generateThumbnail(path)))
  }
  
  async generateThumbnail(path) {
    if (this.cache.has(path)) return this.cache.get(path)
    const thumbnail = await this.createThumbnail(path)
    this.cache.set(path, thumbnail)
    return thumbnail
  }
  
  async createThumbnail(path) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const size = 150
        canvas.width = size
        canvas.height = size
        const scale = Math.min(size / img.width, size / img.height)
        const width = img.width * scale
        const height = img.height * scale
        const x = (size - width) / 2
        const y = (size - height) / 2
        ctx.drawImage(img, x, y, width, height)
        resolve(canvas.toDataURL())
      }
      img.onerror = reject
      img.src = path
    })
  }
  
  chunkArray(array, size) {
    const chunks = []
    for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size))
    return chunks
  }
}

export default new ThumbnailService()
