//
//  AIUpscalingService.swift
//  PicMob
//
//  Created by PicMob Team.
//

import Foundation
import CoreML
import Vision
import CoreImage

class AIUpscalingService {
    private var upscalingModel: MLModel?
    private var objectRemovalModel: MLModel?
    private let ciContext = CIContext()
    
    static let shared = AIUpscalingService()
    
    private init() {
        Task {
            await loadModels()
        }
    }
    
    private func loadModels() async {
        do {
            // Load ESRGAN model for upscaling
            if let modelURL = Bundle.main.url(forResource: "ESRGAN_4x", withExtension: "mlmodelc") {
                upscalingModel = try MLModel(contentsOf: modelURL)
                print("Upscaling model loaded successfully")
            } else {
                print("Upscaling model not found - using fallback implementation")
            }
            
            // Load object removal model
            if let modelURL = Bundle.main.url(forResource: "ObjectRemoval", withExtension: "mlmodelc") {
                objectRemovalModel = try MLModel(contentsOf: modelURL)
                print("Object removal model loaded successfully")
            } else {
                print("Object removal model not found - using fallback implementation")
            }
        } catch {
            print("Failed to load AI models: \(error)")
        }
    }
    
    func upscale(_ image: ImageInfo, factor: Int) async throws -> ImageInfo {
        // If we have a trained model, use it
        if let model = upscalingModel {
            return try await upscaleWithModel(image, factor: factor, model: model)
        } else {
            // Fallback to Core Image upscaling
            return try await upscaleWithCoreImage(image, factor: factor)
        }
    }
    
    private func upscaleWithModel(_ image: ImageInfo, factor: Int, model: MLModel) async throws -> ImageInfo {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    // Prepare input for the model
                    let inputImage = image.ciImage
                    
                    // Create Vision request
                    let request = VNCoreMLRequest(model: VNCoreMLModel(for: model)) { request, error in
                        if let error = error {
                            continuation.resume(throwing: error)
                            return
                        }
                        
                        guard let results = request.results as? [VNPixelBufferObservation],
                              let pixelBuffer = results.first?.pixelBuffer else {
                            continuation.resume(throwing: AIError.processingFailed)
                            return
                        }
                        
                        let upscaledImage = CIImage(cvPixelBuffer: pixelBuffer)
                        
                        if let cgImage = self.ciContext.createCGImage(upscaledImage, from: upscaledImage.extent) {
                            let newImageInfo = ImageInfo(
                                url: image.url,
                                ciImage: upscaledImage,
                                cgImage: cgImage,
                                metadata: image.metadata,
                                format: image.format,
                                size: CGSize(width: cgImage.width, height: cgImage.height),
                                isEdited: true
                            )
                            continuation.resume(returning: newImageInfo)
                        } else {
                            continuation.resume(throwing: AIError.processingFailed)
                        }
                    }
                    
                    let handler = VNImageRequestHandler(ciImage: inputImage)
                    try handler.perform([request])
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    private func upscaleWithCoreImage(_ image: ImageInfo, factor: Int) async throws -> ImageInfo {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    let scale = CGFloat(factor)
                    let transform = CGAffineTransform(scaleX: scale, y: scale)
                    let upscaledImage = image.ciImage.transformed(by: transform)
                    
                    // Apply Lanczos scaling filter for better quality
                    let filter = CIFilter(name: "CILanczosScaleTransform")!
                    filter.setValue(image.ciImage, forKey: kCIInputImageKey)
                    filter.setValue(scale, forKey: kCIInputScaleKey)
                    filter.setValue(1.0, forKey: kCIInputAspectRatioKey)
                    
                    guard let outputImage = filter.outputImage else {
                        throw AIError.processingFailed
                    }
                    
                    if let cgImage = self.ciContext.createCGImage(outputImage, from: outputImage.extent) {
                        let newImageInfo = ImageInfo(
                            url: image.url,
                            ciImage: outputImage,
                            cgImage: cgImage,
                            metadata: image.metadata,
                            format: image.format,
                            size: CGSize(width: cgImage.width, height: cgImage.height),
                            isEdited: true
                        )
                        continuation.resume(returning: newImageInfo)
                    } else {
                        throw AIError.processingFailed
                    }
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    func removeObject(from image: ImageInfo, region: CGRect) async throws -> ImageInfo {
        if let model = objectRemovalModel {
            return try await removeObjectWithModel(image, region: region, model: model)
        } else {
            return try await removeObjectWithInpainting(image, region: region)
        }
    }
    
    private func removeObjectWithModel(_ image: ImageInfo, region: CGRect, model: MLModel) async throws -> ImageInfo {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    // Create a mask for the region to be removed
                    let maskImage = self.createMask(for: region, imageSize: image.size)
                    
                    // Combine original image and mask for the model
                    let combinedImage = self.combineImageAndMask(image.ciImage, mask: maskImage)
                    
                    let request = VNCoreMLRequest(model: VNCoreMLModel(for: model)) { request, error in
                        if let error = error {
                            continuation.resume(throwing: error)
                            return
                        }
                        
                        guard let results = request.results as? [VNPixelBufferObservation],
                              let pixelBuffer = results.first?.pixelBuffer else {
                            continuation.resume(throwing: AIError.processingFailed)
                            return
                        }
                        
                        let processedImage = CIImage(cvPixelBuffer: pixelBuffer)
                        
                        if let cgImage = self.ciContext.createCGImage(processedImage, from: processedImage.extent) {
                            let newImageInfo = ImageInfo(
                                url: image.url,
                                ciImage: processedImage,
                                cgImage: cgImage,
                                metadata: image.metadata,
                                format: image.format,
                                size: image.size,
                                isEdited: true
                            )
                            continuation.resume(returning: newImageInfo)
                        } else {
                            continuation.resume(throwing: AIError.processingFailed)
                        }
                    }
                    
                    let handler = VNImageRequestHandler(ciImage: combinedImage)
                    try handler.perform([request])
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    private func removeObjectWithInpainting(_ image: ImageInfo, region: CGRect) async throws -> ImageInfo {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    // Simple inpainting using surrounding pixels
                    let inpaintedImage = self.simpleInpaint(image.ciImage, region: region)
                    
                    if let cgImage = self.ciContext.createCGImage(inpaintedImage, from: inpaintedImage.extent) {
                        let newImageInfo = ImageInfo(
                            url: image.url,
                            ciImage: inpaintedImage,
                            cgImage: cgImage,
                            metadata: image.metadata,
                            format: image.format,
                            size: image.size,
                            isEdited: true
                        )
                        continuation.resume(returning: newImageInfo)
                    } else {
                        throw AIError.processingFailed
                    }
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    func enhanceImage(_ image: ImageInfo) async throws -> ImageInfo {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    // Apply a series of enhancement filters
                    var enhancedImage = image.ciImage
                    
                    // Auto-adjust exposure
                    if let exposureFilter = CIFilter(name: "CIExposureAdjust") {
                        exposureFilter.setValue(enhancedImage, forKey: kCIInputImageKey)
                        exposureFilter.setValue(0.2, forKey: kCIInputEVKey)
                        if let output = exposureFilter.outputImage {
                            enhancedImage = output
                        }
                    }
                    
                    // Enhance contrast
                    if let contrastFilter = CIFilter(name: "CIColorControls") {
                        contrastFilter.setValue(enhancedImage, forKey: kCIInputImageKey)
                        contrastFilter.setValue(1.1, forKey: kCIInputContrastKey)
                        contrastFilter.setValue(1.05, forKey: kCIInputSaturationKey)
                        if let output = contrastFilter.outputImage {
                            enhancedImage = output
                        }
                    }
                    
                    // Sharpen slightly
                    if let sharpenFilter = CIFilter(name: "CISharpenLuminance") {
                        sharpenFilter.setValue(enhancedImage, forKey: kCIInputImageKey)
                        sharpenFilter.setValue(0.3, forKey: kCIInputSharpnessKey)
                        if let output = sharpenFilter.outputImage {
                            enhancedImage = output
                        }
                    }
                    
                    // Reduce noise
                    if let noiseFilter = CIFilter(name: "CINoiseReduction") {
                        noiseFilter.setValue(enhancedImage, forKey: kCIInputImageKey)
                        noiseFilter.setValue(0.02, forKey: kCIInputNoiseReductionKey)
                        if let output = noiseFilter.outputImage {
                            enhancedImage = output
                        }
                    }
                    
                    if let cgImage = self.ciContext.createCGImage(enhancedImage, from: enhancedImage.extent) {
                        let newImageInfo = ImageInfo(
                            url: image.url,
                            ciImage: enhancedImage,
                            cgImage: cgImage,
                            metadata: image.metadata,
                            format: image.format,
                            size: image.size,
                            isEdited: true
                        )
                        continuation.resume(returning: newImageInfo)
                    } else {
                        throw AIError.processingFailed
                    }
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    // MARK: - Helper Methods
    
    private func createMask(for region: CGRect, imageSize: CGSize) -> CIImage {
        // Create a black image with a white rectangle for the mask
        let blackImage = CIImage(color: CIColor.black).cropped(to: CGRect(origin: .zero, size: imageSize))
        let whiteImage = CIImage(color: CIColor.white).cropped(to: region)
        
        // Composite the white rectangle onto the black background
        let compositeFilter = CIFilter(name: "CISourceOverCompositing")!
        compositeFilter.setValue(whiteImage, forKey: kCIInputImageKey)
        compositeFilter.setValue(blackImage, forKey: kCIInputBackgroundImageKey)
        
        return compositeFilter.outputImage ?? blackImage
    }
    
    private func combineImageAndMask(_ image: CIImage, mask: CIImage) -> CIImage {
        // For ML models that expect image + mask as input
        // This is a simplified version - actual implementation would depend on model requirements
        return image
    }
    
    private func simpleInpaint(_ image: CIImage, region: CGRect) -> CIImage {
        // Simple inpainting by blurring the region and blending with surrounding areas
        let blurFilter = CIFilter(name: "CIGaussianBlur")!
        blurFilter.setValue(image, forKey: kCIInputImageKey)
        blurFilter.setValue(10.0, forKey: kCIInputRadiusKey)
        
        guard let blurredImage = blurFilter.outputImage else {
            return image
        }
        
        // Create a mask for blending
        let maskImage = createMask(for: region, imageSize: image.extent.size)
        
        // Blend the blurred region with the original image
        let blendFilter = CIFilter(name: "CIBlendWithMask")!
        blendFilter.setValue(blurredImage, forKey: kCIInputImageKey)
        blendFilter.setValue(image, forKey: kCIInputBackgroundImageKey)
        blendFilter.setValue(maskImage, forKey: kCIInputMaskImageKey)
        
        return blendFilter.outputImage ?? image
    }
}

enum AIError: Error {
    case modelNotLoaded
    case processingFailed
    case invalidInput
    case unsupportedOperation
    
    var localizedDescription: String {
        switch self {
        case .modelNotLoaded:
            return "AI model not loaded"
        case .processingFailed:
            return "AI processing failed"
        case .invalidInput:
            return "Invalid input for AI processing"
        case .unsupportedOperation:
            return "Unsupported AI operation"
        }
    }
}

