//
//  ImageService.swift
//  PicMob
//
//  Created by PicMob Team.
//

import Foundation
import CoreImage
import ImageIO
import CoreGraphics

@MainActor
class ImageService: ObservableObject {
    private let ciContext = CIContext()
    
    func loadImage(from url: URL) async throws -> ImageInfo {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    guard let imageSource = CGImageSourceCreateWithURL(url as CFURL, nil) else {
                        throw ImageError.invalidFile
                    }
                    
                    guard let cgImage = CGImageSourceCreateImageAtIndex(imageSource, 0, nil) else {
                        throw ImageError.failedToLoad
                    }
                    
                    let ciImage = CIImage(cgImage: cgImage)
                    let metadata = ImageMetadata(from: imageSource)
                    
                    let imageInfo = ImageInfo(
                        url: url,
                        ciImage: ciImage,
                        cgImage: cgImage,
                        metadata: metadata,
                        format: ImageFormat.from(extension: url.pathExtension),
                        size: CGSize(width: cgImage.width, height: cgImage.height)
                    )
                    
                    continuation.resume(returning: imageInfo)
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    func applyFilter(_ filter: ImageFilter, to image: ImageInfo) async throws -> ImageInfo {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    let filteredImage = try self.processFilter(filter, image: image.ciImage)
                    let cgImage = self.ciContext.createCGImage(filteredImage, from: filteredImage.extent)!
                    
                    let newImageInfo = ImageInfo(
                        url: image.url,
                        ciImage: filteredImage,
                        cgImage: cgImage,
                        metadata: image.metadata,
                        format: image.format,
                        size: image.size,
                        isEdited: true
                    )
                    
                    continuation.resume(returning: newImageInfo)
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    func rotateImage(_ image: ImageInfo, degrees: Double) async throws -> ImageInfo {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                let radians = degrees * .pi / 180
                let rotatedImage = image.ciImage.transformed(by: CGAffineTransform(rotationAngle: radians))
                
                if let cgImage = self.ciContext.createCGImage(rotatedImage, from: rotatedImage.extent) {
                    let newImageInfo = ImageInfo(
                        url: image.url,
                        ciImage: rotatedImage,
                        cgImage: cgImage,
                        metadata: image.metadata,
                        format: image.format,
                        size: CGSize(width: cgImage.width, height: cgImage.height),
                        isEdited: true
                    )
                    continuation.resume(returning: newImageInfo)
                } else {
                    continuation.resume(throwing: ImageError.processingFailed)
                }
            }
        }
    }
    
    func exportImage(_ image: ImageInfo, to url: URL, format: ImageFormat) async throws {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    let destination = CGImageDestinationCreateWithURL(url as CFURL, format.uti as CFString, 1, nil)
                    guard let dest = destination else {
                        throw ImageError.processingFailed
                    }
                    
                    CGImageDestinationAddImage(dest, image.cgImage, nil)
                    
                    if CGImageDestinationFinalize(dest) {
                        continuation.resume()
                    } else {
                        throw ImageError.processingFailed
                    }
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    private func processFilter(_ filter: ImageFilter, image: CIImage) throws -> CIImage {
        switch filter.type {
        case .sepia:
            return image.applyingFilter("CISepiaTone", parameters: ["inputIntensity": filter.intensity])
        case .blur:
            return image.applyingFilter("CIGaussianBlur", parameters: ["inputRadius": filter.radius])
        case .sharpen:
            return image.applyingFilter("CISharpenLuminance", parameters: ["inputSharpness": filter.amount])
        case .exposure:
            return image.applyingFilter("CIExposureAdjust", parameters: ["inputEV": filter.value])
        case .contrast:
            return image.applyingFilter("CIColorControls", parameters: ["inputContrast": filter.value])
        case .saturation:
            return image.applyingFilter("CIColorControls", parameters: ["inputSaturation": filter.value])
        case .temperature:
            return image.applyingFilter("CITemperatureAndTint", parameters: ["inputNeutral": CIVector(x: filter.value, y: 0)])
        }
    }
    
    func getSupportedFormats() -> [ImageFormat] {
        return ImageFormat.allCases
    }
}

extension ImageService {
    func loadImages(in directory: URL) async throws -> [ImageInfo] {
        let allowed = Set(["jpg","jpeg","png","heic","tiff","gif","bmp","webp"])
        let fm = FileManager.default
        guard let e = fm.enumerator(at: directory,
                                    includingPropertiesForKeys: [.isRegularFileKey],
                                    options: [.skipsHiddenFiles, .skipsPackageDescendants]) else { return [] }
        var urls: [URL] = []
        for case let url as URL in e where allowed.contains(url.pathExtension.lowercased()) {
            urls.append(url)
        }
        var images: [ImageInfo] = []
        for url in urls {
            do { images.append(try await loadImage(from: url)) }
            catch { print("Skip \(url.lastPathComponent):", error) }
        }
        return images
    }
}

struct ImageFilter {
    let type: FilterType
    let intensity: Float
    let radius: Float
    let amount: Float
    let value: Float
    
    enum FilterType {
        case sepia, blur, sharpen, exposure, contrast, saturation, temperature
    }
}

enum ImageError: Error {
    case invalidFile
    case failedToLoad
    case unsupportedFormat
    case processingFailed
    
    var localizedDescription: String {
        switch self {
        case .invalidFile:
            return "Invalid image file"
        case .failedToLoad:
            return "Failed to load image"
        case .unsupportedFormat:
            return "Unsupported image format"
        case .processingFailed:
            return "Image processing failed"
        }
    }
}

