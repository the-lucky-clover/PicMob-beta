// Model Signing & Verification
const crypto = require('crypto')

class ModelSigner {
  constructor(privateKey) {
    this.privateKey = privateKey
  }
  
  signModel(modelPath) {
    const fs = require('fs')
    const modelBuffer = fs.readFileSync(modelPath)
    const signature = crypto
      .createSign('sha256')
      .update(modelBuffer)
      .sign(this.privateKey, 'hex')
    
    return {
      model: modelPath,
      signature: signature,
      publicKeyId: 'picmob-v1'
    }
  }
  
  static verifyModel(modelBuffer, signature, publicKey) {
    return crypto
      .createVerify('sha256')
      .update(modelBuffer)
      .verify(publicKey, signature, 'hex')
  }
}

module.exports = ModelSigner
