//
//  ViewerToolbar.swift
//  PicMob
//
//  Created by PicMob Team.
//

import SwiftUI

struct ViewerToolbar: View {
    let image: ImageInfo
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var imageService: ImageService
    @State private var showingExportDialog = false
    
    var body: some View {
        HStack(spacing: 12) {
            // Zoom controls
            Group {
                ToolbarButton(
                    icon: "plus.magnifyingglass",
                    tooltip: "Zoom In (⌘+)",
                    action: {
                        NotificationCenter.default.post(name: .zoomIn, object: nil)
                    }
                )
                
                ToolbarButton(
                    icon: "minus.magnifyingglass",
                    tooltip: "Zoom Out (⌘-)",
                    action: {
                        NotificationCenter.default.post(name: .zoomOut, object: nil)
                    }
                )
                
                ToolbarButton(
                    icon: "1.square",
                    tooltip: "Actual Size (⌘0)",
                    action: {
                        NotificationCenter.default.post(name: .actualSize, object: nil)
                    }
                )
                
                ToolbarButton(
                    icon: "rectangle.expand.vertical",
                    tooltip: "Fit to Window (⌘9)",
                    action: {
                        NotificationCenter.default.post(name: .fitToWindow, object: nil)
                    }
                )
            }
            
            Divider()
                .frame(height: 20)
                .background(PicMobTheme.borderColor)
            
            // Rotation controls
            Group {
                ToolbarButton(
                    icon: "rotate.left",
                    tooltip: "Rotate Left (⌘⌥L)",
                    action: {
                        rotateImage(-90)
                    }
                )
                
                ToolbarButton(
                    icon: "rotate.right",
                    tooltip: "Rotate Right (⌘⌥R)",
                    action: {
                        rotateImage(90)
                    }
                )
            }
            
            Divider()
                .frame(height: 20)
                .background(PicMobTheme.borderColor)
            
            // AI and enhancement tools
            Group {
                ToolbarButton(
                    icon: "wand.and.rays",
                    tooltip: "AI Enhance",
                    action: {
                        aiEnhance()
                    }
                )
                
                Menu {
                    Button("2x Upscale") {
                        aiUpscale(factor: 2)
                    }
                    
                    Button("4x Upscale") {
                        aiUpscale(factor: 4)
                    }
                    
                    Divider()
                    
                    Button("Remove Object") {
                        // Object removal functionality
                    }
                    
                    Button("Background Removal") {
                        // Background removal functionality
                    }
                } label: {
                    Image(systemName: "brain.head.profile")
                        .foregroundColor(PicMobTheme.goldAccent)
                }
                .menuStyle(BorderlessButtonMenuStyle())
                .help("AI Tools")
            }
            
            Divider()
                .frame(height: 20)
                .background(PicMobTheme.borderColor)
            
            // Export and sharing
            Group {
                ToolbarButton(
                    icon: "square.and.arrow.up",
                    tooltip: "Export (⌘E)",
                    action: {
                        showingExportDialog = true
                    }
                )
                
                Menu {
                    Button("Copy to Clipboard") {
                        copyToClipboard()
                    }
                    
                    Button("Set as Desktop Wallpaper") {
                        setAsWallpaper()
                    }
                    
                    Divider()
                    
                    Button("Share via AirDrop") {
                        shareViaAirDrop()
                    }
                    
                    Button("Share via Messages") {
                        shareViaMessages()
                    }
                } label: {
                    Image(systemName: "square.and.arrow.up.on.square")
                        .foregroundColor(PicMobTheme.goldAccent)
                }
                .menuStyle(BorderlessButtonMenuStyle())
                .help("Share Options")
            }
            
            Spacer()
            
            // Image info
            Text("\(Int(image.size.width)) × \(Int(image.size.height))")
                .font(PicMobTheme.captionFont)
                .foregroundColor(PicMobTheme.mutedText)
            
            Text(image.format.rawValue.uppercased())
                .font(PicMobTheme.captionFont)
                .foregroundColor(PicMobTheme.accentText)
                .padding(.horizontal, 8)
                .padding(.vertical, 2)
                .background(
                    RoundedRectangle(cornerRadius: 4)
                        .fill(PicMobTheme.goldAccent.opacity(0.2))
                )
        }
        .padding(.horizontal)
        .sheet(isPresented: $showingExportDialog) {
            ExportDialog(image: image)
        }
    }
    
    private func rotateImage(_ degrees: Double) {
        appState.isProcessing = true
        
        Task {
            do {
                let rotatedImage = try await imageService.rotateImage(image, degrees: degrees)
                await MainActor.run {
                    appState.currentImage = rotatedImage
                    appState.isProcessing = false
                }
            } catch {
                await MainActor.run {
                    appState.errorMessage = "Failed to rotate image: \(error.localizedDescription)"
                    appState.isProcessing = false
                }
            }
        }
    }
    
    private func aiEnhance() {
        appState.isProcessing = true
        
        // Simulate AI enhancement
        Task {
            for i in 0...100 {
                await MainActor.run {
                    appState.processingProgress = Double(i) / 100.0
                }
                try? await Task.sleep(nanoseconds: 20_000_000) // 0.02 seconds
            }
            
            await MainActor.run {
                appState.isProcessing = false
                appState.processingProgress = 0.0
            }
        }
    }
    
    private func aiUpscale(factor: Int) {
        appState.isProcessing = true
        
        // Simulate AI upscaling
        Task {
            for i in 0...100 {
                await MainActor.run {
                    appState.processingProgress = Double(i) / 100.0
                }
                try? await Task.sleep(nanoseconds: 50_000_000) // 0.05 seconds
            }
            
            await MainActor.run {
                appState.isProcessing = false
                appState.processingProgress = 0.0
            }
        }
    }
    
    private func copyToClipboard() {
        let pasteboard = NSPasteboard.general
        pasteboard.clearContents()
        pasteboard.setData(image.cgImage.dataProvider?.data, forType: .tiff)
    }
    
    private func setAsWallpaper() {
        do {
            try NSWorkspace.shared.setDesktopImageURL(image.url, for: NSScreen.main!, options: [:])
        } catch {
            appState.errorMessage = "Failed to set wallpaper: \(error.localizedDescription)"
        }
    }
    
    private func shareViaAirDrop() {
        let picker = NSSharingServicePicker(items: [image.url])
        if let button = NSApp.keyWindow?.contentView {
            picker.show(relativeTo: .zero, of: button, preferredEdge: .minY)
        }
    }
    
    private func shareViaMessages() {
        if let service = NSSharingService(named: .sendViaMessages) {
            service.perform(withItems: [image.url])
        }
    }
}

struct ToolbarButton: View {
    let icon: String
    let tooltip: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .foregroundColor(PicMobTheme.goldAccent)
                .frame(width: 20, height: 20)
        }
        .buttonStyle(PlainButtonStyle())
        .help(tooltip)
        .onHover { isHovered in
            if isHovered {
                NSCursor.pointingHand.push()
            } else {
                NSCursor.pop()
            }
        }
    }
}

struct ExportDialog: View {
    let image: ImageInfo
    @Environment(\.dismiss) private var dismiss
    @State private var selectedFormat: ImageFormat = .jpeg
    @State private var quality: Double = 0.9
    @State private var exportURL: URL?
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Export Image")
                .font(PicMobTheme.headlineFont)
                .foregroundColor(PicMobTheme.goldAccent)
            
            VStack(alignment: .leading, spacing: 12) {
                Text("Format:")
                    .font(PicMobTheme.bodyFont)
                    .foregroundColor(PicMobTheme.primaryText)
                
                Picker("Format", selection: $selectedFormat) {
                    ForEach(ImageFormat.allCases, id: \.self) { format in
                        Text(format.rawValue.uppercased()).tag(format)
                    }
                }
                .pickerStyle(MenuPickerStyle())
                
                if selectedFormat == .jpeg {
                    Text("Quality:")
                        .font(PicMobTheme.bodyFont)
                        .foregroundColor(PicMobTheme.primaryText)
                    
                    Slider(value: $quality, in: 0.1...1.0, step: 0.1)
                        .accentColor(PicMobTheme.goldAccent)
                    
                    Text("\(Int(quality * 100))%")
                        .font(PicMobTheme.captionFont)
                        .foregroundColor(PicMobTheme.mutedText)
                }
            }
            
            HStack {
                Button("Cancel") {
                    dismiss()
                }
                .buttonStyle(PlainButtonStyle())
                
                Spacer()
                
                Button("Export") {
                    exportImage()
                }
                .buttonStyle(PicMobButtonStyle())
            }
        }
        .padding(24)
        .frame(width: 300)
        .background(PicMobTheme.sidebarBackground)
    }
    
    private func exportImage() {
        let panel = NSSavePanel()
        panel.allowedContentTypes = [selectedFormat.contentType].compactMap { $0 }
        panel.nameFieldStringValue = image.url.deletingPathExtension().lastPathComponent + "." + selectedFormat.rawValue
        
        if panel.runModal() == .OK, let url = panel.url {
            Task {
                do {
                    let imageService = ImageService()
                    try await imageService.exportImage(image, to: url, format: selectedFormat)
                    await MainActor.run {
                        dismiss()
                    }
                } catch {
                    print("Export failed: \(error)")
                }
            }
        }
    }
}

#Preview {
    let sampleImage = ImageInfo(
        url: URL(fileURLWithPath: "/sample.jpg"),
        ciImage: CIImage(),
        cgImage: CGImage.empty,
        metadata: ImageMetadata(),
        format: .jpeg,
        size: CGSize(width: 1920, height: 1080)
    )
    
    ViewerToolbar(image: sampleImage)
        .environmentObject(AppState())
        .environmentObject(ImageService())
}

