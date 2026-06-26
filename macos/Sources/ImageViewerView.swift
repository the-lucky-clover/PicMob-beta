//
//  ImageViewerView.swift
//  PicMob
//
//  Created by PicMob Team.
//

import SwiftUI
import AppKit

struct ImageViewerView: View {
    let image: ImageInfo
    @State private var scale: CGFloat = 1.0
    @State private var offset: CGSize = .zero
    @State private var lastScale: CGFloat = 1.0
    @State private var lastOffset: CGSize = .zero
    @State private var showingInfo: Bool = false
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background
                PicMobTheme.viewerBackground
                    .ignoresSafeArea()
                
                // Image
                if let uiImage = image.uiImage {
                    Image(uiImage: uiImage)
                        .resizable()
                        .scaledToFit()
                        .scaleEffect(scale)
                        .offset(offset)
                        .gesture(
                            SimultaneousGesture(
                                MagnificationGesture()
                                    .onChanged { value in
                                        scale = lastScale * value
                                    }
                                    .onEnded { value in
                                        lastScale = scale
                                        
                                        // Limit zoom levels
                                        if scale < 0.1 {
                                            scale = 0.1
                                            lastScale = 0.1
                                        } else if scale > 10.0 {
                                            scale = 10.0
                                            lastScale = 10.0
                                        }
                                    },
                                
                                DragGesture()
                                    .onChanged { value in
                                        offset = CGSize(
                                            width: lastOffset.width + value.translation.width,
                                            height: lastOffset.height + value.translation.height
                                        )
                                    }
                                    .onEnded { value in
                                        lastOffset = offset
                                    }
                            )
                        )
                        .onTapGesture(count: 2) {
                            // Double tap to fit or actual size
                            withAnimation(.easeInOut(duration: 0.3)) {
                                if scale == 1.0 {
                                    fitToWindow(geometry: geometry)
                            } else {
                                actualSize()
                            }
                            }
                        }
                } else {
                    Text("Unable to display image")
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
                
                // Info overlay
                if showingInfo {
                    VStack {
                        Spacer()
                        
                        ImageInfoOverlay(image: image)
                            .padding()
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(PicMobTheme.sidebarBackground.opacity(0.9))
                                    .shadow(radius: 10)
                            )
                            .padding()
                    }
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: .zoomIn)) { _ in
            zoomIn()
        }
        .onReceive(NotificationCenter.default.publisher(for: .zoomOut)) { _ in
            zoomOut()
        }
        .onReceive(NotificationCenter.default.publisher(for: .actualSize)) { _ in
            actualSize()
        }
        .onReceive(NotificationCenter.default.publisher(for: .fitToWindow)) { _ in
            // We need geometry for this, so we'll handle it in the gesture
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        showingInfo.toggle()
                    }
                }) {
                    Image(systemName: showingInfo ? "info.circle.fill" : "info.circle")
                        .foregroundColor(PicMobTheme.goldAccent)
                }
            }
        }
    }
    
    private func zoomIn() {
        withAnimation(.easeInOut(duration: 0.2)) {
            scale = min(scale * 1.5, 10.0)
            lastScale = scale
        }
    }
    
    private func zoomOut() {
        withAnimation(.easeInOut(duration: 0.2)) {
            scale = max(scale / 1.5, 0.1)
            lastScale = scale
        }
    }
    
    private func actualSize() {
        withAnimation(.easeInOut(duration: 0.3)) {
            scale = 1.0
            lastScale = 1.0
            offset = .zero
            lastOffset = .zero
        }
    }
    
    private func fitToWindow(geometry: GeometryProxy) {
        let imageSize = image.size
        let containerSize = geometry.size
        
        let scaleX = containerSize.width / imageSize.width
        let scaleY = containerSize.height / imageSize.height
        let fitScale = min(scaleX, scaleY) * 0.9 // 90% to leave some margin
        
        scale = fitScale
        lastScale = fitScale
        offset = .zero
        lastOffset = .zero
    }
}

struct ImageInfoOverlay: View {
    let image: ImageInfo
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // File info
            VStack(alignment: .leading, spacing: 4) {
                Text("FILE INFORMATION")
                    .font(PicMobTheme.bodyFont.weight(.semibold))
                    .foregroundColor(PicMobTheme.goldAccent)
                
                InfoRow(label: "Name", value: image.displayName)
                InfoRow(label: "Size", value: "\(Int(image.size.width)) × \(Int(image.size.height))")
                InfoRow(label: "Format", value: image.format.rawValue.uppercased())
                InfoRow(label: "File Size", value: image.fileSize)
            }
            
            // EXIF info
            if !image.metadata.exifData.isEmpty {
                Divider()
                    .background(PicMobTheme.borderColor)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("CAMERA INFORMATION")
                        .font(PicMobTheme.bodyFont.weight(.semibold))
                        .foregroundColor(PicMobTheme.goldAccent)
                    
                    if let camera = image.metadata.cameraModel {
                        InfoRow(label: "Camera", value: camera)
                    }
                    
                    if let lens = image.metadata.lensModel {
                        InfoRow(label: "Lens", value: lens)
                    }
                    
                    if let focal = image.metadata.focalLength {
                        InfoRow(label: "Focal Length", value: focal)
                    }
                    
                    if let aperture = image.metadata.aperture {
                        InfoRow(label: "Aperture", value: "f/\(aperture)")
                    }
                    
                    if let shutter = image.metadata.shutterSpeed {
                        InfoRow(label: "Shutter", value: "\(shutter)s")
                    }
                    
                    if let iso = image.metadata.iso {
                        InfoRow(label: "ISO", value: iso)
                    }
                }
            }
            
            // Color info
            Divider()
                .background(PicMobTheme.borderColor)
            
            VStack(alignment: .leading, spacing: 4) {
                Text("COLOR INFORMATION")
                    .font(PicMobTheme.bodyFont.weight(.semibold))
                    .foregroundColor(PicMobTheme.goldAccent)
                
                InfoRow(label: "Color Space", value: image.metadata.colorSpace)
                InfoRow(label: "Has Alpha", value: image.metadata.hasAlpha ? "Yes" : "No")
                InfoRow(label: "DPI", value: "\(Int(image.metadata.dpi.x)) × \(Int(image.metadata.dpi.y))")
            }
        }
        .padding()
        .frame(maxWidth: 300)
    }
}

struct InfoRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
                .font(PicMobTheme.captionFont)
                .foregroundColor(PicMobTheme.mutedText)
                .frame(width: 80, alignment: .leading)
            
            Text(value)
                .font(PicMobTheme.captionFont)
                .foregroundColor(PicMobTheme.primaryText)
                .lineLimit(1)
            
            Spacer()
        }
    }
}

#Preview {
    // Create a sample image for preview
    let sampleImage = ImageInfo(
        url: URL(fileURLWithPath: "/sample.jpg"),
        ciImage: CIImage(),
        cgImage: CGImage.empty,
        metadata: ImageMetadata(),
        format: .jpeg,
        size: CGSize(width: 1920, height: 1080)
    )
    
    ImageViewerView(image: sampleImage)
}

// Extension to create empty CGImage for preview
extension CGImage {
    static var empty: CGImage {
        let context = CGContext(
            data: nil,
            width: 1,
            height: 1,
            bitsPerComponent: 8,
            bytesPerRow: 4,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        )!
        return context.makeImage()!
    }
}

