//
//  ImageInfo.swift
//  PicMob
//
//  Created by PicMob Team.
//

import Foundation
import CoreImage
import CoreGraphics
import UniformTypeIdentifiers

struct ImageInfo: Identifiable {
    let id = UUID()
    let url: URL
    let ciImage: CIImage
    let cgImage: CGImage
    let metadata: ImageMetadata
    let format: ImageFormat
    let size: CGSize
    var isEdited: Bool = false
    
    var displayName: String {
        url.lastPathComponent
    }
    
    var fileSize: String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useKB, .useMB, .useGB]
        formatter.countStyle = .file
        
        do {
            let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
            if let size = attributes[.size] as? Int64 {
                return formatter.string(fromByteCount: size)
            }
        } catch {
            print("Error getting file size: \(error)")
        }
        
        return "Unknown"
    }
}

struct ImageMetadata {
    let exifData: [String: Any]
    let colorSpace: String
    let hasAlpha: Bool
    let orientation: Int
    let dpi: (x: Double, y: Double)
    let creationDate: Date?
    let cameraModel: String?
    let lensModel: String?
    let focalLength: String?
    let aperture: String?
    let shutterSpeed: String?
    let iso: String?
    
    init() {
        self.exifData = [:]
        self.colorSpace = "Unknown"
        self.hasAlpha = false
        self.orientation = 1
        self.dpi = (72.0, 72.0)
        self.creationDate = nil
        self.cameraModel = nil
        self.lensModel = nil
        self.focalLength = nil
        self.aperture = nil
        self.shutterSpeed = nil
        self.iso = nil
    }
    
    init(from imageSource: CGImageSource) {
        // Extract metadata from image source
        let properties = CGImageSourceCopyPropertiesAtIndex(imageSource, 0, nil) as? [String: Any] ?? [:]
        
        self.exifData = properties[kCGImagePropertyExifDictionary as String] as? [String: Any] ?? [:]
        self.colorSpace = properties[kCGImagePropertyColorModel as String] as? String ?? "Unknown"
        self.hasAlpha = properties[kCGImagePropertyHasAlpha as String] as? Bool ?? false
        self.orientation = properties[kCGImagePropertyOrientation as String] as? Int ?? 1
        
        // Extract DPI
        let dpiX = properties[kCGImagePropertyDPIWidth as String] as? Double ?? 72.0
        let dpiY = properties[kCGImagePropertyDPIHeight as String] as? Double ?? 72.0
        self.dpi = (x: dpiX, y: dpiY)
        
        // Extract EXIF data
        if let exif = exifData as? [String: Any] {
            self.cameraModel = exif[kCGImagePropertyExifCameraOwnerName as String] as? String
            self.lensModel = exif[kCGImagePropertyExifLensModel as String] as? String
            self.focalLength = exif[kCGImagePropertyExifFocalLength as String] as? String
            self.aperture = exif[kCGImagePropertyExifFNumber as String] as? String
            self.shutterSpeed = exif[kCGImagePropertyExifExposureTime as String] as? String
            self.iso = exif[kCGImagePropertyExifISOSpeedRatings as String] as? String
        } else {
            self.cameraModel = nil
            self.lensModel = nil
            self.focalLength = nil
            self.aperture = nil
            self.shutterSpeed = nil
            self.iso = nil
        }
        
        // Extract creation date
        if let dateString = properties[kCGImagePropertyExifDateTimeOriginal as String] as? String {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy:MM:dd HH:mm:ss"
            self.creationDate = formatter.date(from: dateString)
        } else {
            self.creationDate = nil
        }
    }
}

enum ImageFormat: String, CaseIterable {
    case jpeg = "jpg"
    case png = "png"
    case gif = "gif"
    case tiff = "tiff"
    case bmp = "bmp"
    case webp = "webp"
    case heic = "heic"
    case heif = "heif"
    case avif = "avif"
    case raw = "raw"
    case dng = "dng"
    case cr2 = "cr2"
    case cr3 = "cr3"
    case nef = "nef"
    case arw = "arw"
    case orf = "orf"
    case rw2 = "rw2"
    case psd = "psd"
    
    static func from(extension: String) -> ImageFormat {
        return ImageFormat(rawValue: extension.lowercased()) ?? .jpeg
    }
    
    var contentType: UTType? {
        switch self {
        case .jpeg: return .jpeg
        case .png: return .png
        case .gif: return .gif
        case .tiff: return .tiff
        case .bmp: return .bmp
        case .webp: return UTType("org.webmproject.webp")
        case .heic: return .heic
        case .heif: return .heif
        case .avif: return UTType("public.avif")
        case .raw: return .rawImage
        case .dng: return UTType("com.adobe.raw-image")
        case .cr2: return UTType("com.canon.cr2-raw-image")
        case .cr3: return UTType("com.canon.cr3-raw-image")
        case .nef: return UTType("com.nikon.raw-image")
        case .arw: return UTType("com.sony.arw-raw-image")
        case .orf: return UTType("com.olympus.raw-image")
        case .rw2: return UTType("com.panasonic.rw2-raw-image")
        case .psd: return UTType("com.adobe.photoshop-image")
        }
    }
    
    var uti: String {
        return contentType?.identifier ?? "public.image"
    }
}

