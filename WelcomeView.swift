//
//  WelcomeView.swift
//  PicMob
//
//  Created by PicMob Team.
//

import SwiftUI

struct WelcomeView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        VStack(spacing: 32) {
            // Logo and branding
            VStack(spacing: 16) {
                Image(systemName: "crown.fill")
                    .font(.system(size: 80))
                    .foregroundColor(PicMobTheme.goldAccent)
                    .shadow(color: PicMobTheme.goldAccent.opacity(0.3), radius: 10, x: 0, y: 0)
                
                Text("PicMob")
                    .font(PicMobTheme.titleFont.weight(.heavy))
                    .foregroundColor(PicMobTheme.goldAccent)
                    .shadow(color: PicMobTheme.goldAccent.opacity(0.3), radius: 5, x: 0, y: 0)
                
                Text("An offer your images can't refuse")
                    .font(PicMobTheme.headlineFont)
                    .foregroundColor(PicMobTheme.primaryText)
                    .italic()
                    .multilineTextAlignment(.center)
            }
            
            // Feature highlights
            VStack(spacing: 20) {
                FeatureRow(
                    icon: "photo.stack",
                    title: "50+ Formats Supported",
                    description: "RAW, PSD, HEIC, WEBP, and more"
                )
                
                FeatureRow(
                    icon: "brain.head.profile",
                    title: "AI-Powered Enhancement",
                    description: "Upscaling, object removal, and smart filters"
                )
                
                FeatureRow(
                    icon: "bolt.fill",
                    title: "Lightning Fast Performance",
                    description: "50% faster than the competition"
                )
                
                FeatureRow(
                    icon: "paintbrush.pointed",
                    title: "Professional Interface",
                    description: "Designed for power users and professionals"
                )
            }
            
            Spacer()
            
            // Getting started
            VStack(spacing: 16) {
                Text("GET STARTED")
                    .font(PicMobTheme.bodyFont.weight(.semibold))
                    .foregroundColor(PicMobTheme.accentText)
                
                HStack(spacing: 16) {
                    WelcomeButton(
                        icon: "folder.badge.plus",
                        title: "Open Folder",
                        subtitle: "Browse image collections",
                        action: openFolder
                    )
                    
                    WelcomeButton(
                        icon: "photo.badge.plus",
                        title: "Open Image",
                        subtitle: "View a single image",
                        action: openImage
                    )
                }
                
                Text("Or drag and drop images anywhere")
                    .font(PicMobTheme.captionFont)
                    .foregroundColor(PicMobTheme.mutedText)
                    .padding(.top, 8)
            }
            
            Spacer()
            
            // Recent files
            if !appState.recentFiles.isEmpty {
                VStack(alignment: .leading, spacing: 12) {
                    Text("RECENT FILES")
                        .font(PicMobTheme.bodyFont.weight(.semibold))
                        .foregroundColor(PicMobTheme.accentText)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(appState.recentFiles.prefix(5), id: \.self) { url in
                                RecentFileCard(url: url)
                            }
                        }
                        .padding(.horizontal, 1)
                    }
                }
                .frame(maxWidth: 600)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            // Subtle background pattern
            ZStack {
                PicMobTheme.viewerBackground
                
                // Subtle grid pattern
                Canvas { context, size in
                    let gridSize: CGFloat = 50
                    let lineWidth: CGFloat = 0.5
                    
                    context.stroke(
                        Path { path in
                            for x in stride(from: 0, through: size.width, by: gridSize) {
                                path.move(to: CGPoint(x: x, y: 0))
                                path.addLine(to: CGPoint(x: x, y: size.height))
                            }
                            for y in stride(from: 0, through: size.height, by: gridSize) {
                                path.move(to: CGPoint(x: 0, y: y))
                                path.addLine(to: CGPoint(x: size.width, y: y))
                            }
                        },
                        with: .color(PicMobTheme.borderColor.opacity(0.1)),
                        lineWidth: lineWidth
                    )
                }
            }
        )
        .padding(40)
    }
    
    private func openFolder() {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        panel.title = "Choose a folder containing images"
        panel.prompt = "Open Folder"
        
        if panel.runModal() == .OK, let url = panel.url {
            NotificationCenter.default.post(name: .openFolder, object: url)
        }
    }
    
    private func openImage() {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false
        panel.canChooseFiles = true
        panel.title = "Choose an image to view"
        panel.prompt = "Open Image"
        panel.allowedContentTypes = ImageFormat.allCases.compactMap { $0.contentType }
        
        if panel.runModal() == .OK, let url = panel.url {
            NotificationCenter.default.post(name: .openFile, object: url)
        }
    }
}

struct FeatureRow: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(PicMobTheme.goldAccent)
                .frame(width: 32)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(PicMobTheme.bodyFont.weight(.semibold))
                    .foregroundColor(PicMobTheme.primaryText)
                
                Text(description)
                    .font(PicMobTheme.captionFont)
                    .foregroundColor(PicMobTheme.mutedText)
            }
            
            Spacer()
        }
        .frame(maxWidth: 400)
    }
}

struct WelcomeButton: View {
    let icon: String
    let title: String
    let subtitle: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title)
                    .foregroundColor(PicMobTheme.goldAccent)
                
                VStack(spacing: 4) {
                    Text(title)
                        .font(PicMobTheme.bodyFont.weight(.semibold))
                        .foregroundColor(PicMobTheme.primaryText)
                    
                    Text(subtitle)
                        .font(PicMobTheme.captionFont)
                        .foregroundColor(PicMobTheme.mutedText)
                        .multilineTextAlignment(.center)
                }
            }
            .frame(width: 140, height: 100)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(PicMobTheme.sidebarBackground)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(PicMobTheme.borderColor, lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
        .onHover { isHovered in
            // Add hover effect if needed
        }
    }
}

struct RecentFileCard: View {
    let url: URL
    @State private var thumbnail: NSImage?
    
    var body: some View {
        VStack(spacing: 8) {
            // Thumbnail
            Group {
                if let thumbnail = thumbnail {
                    Image(nsImage: thumbnail)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } else {
                    Rectangle()
                        .fill(PicMobTheme.sidebarBackground)
                        .overlay(
                            Image(systemName: "photo")
                                .foregroundColor(PicMobTheme.mutedText)
                        )
                }
            }
            .frame(width: 80, height: 60)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(PicMobTheme.borderColor, lineWidth: 1)
            )
            
            // File name
            Text(url.lastPathComponent)
                .font(PicMobTheme.captionFont)
                .foregroundColor(PicMobTheme.primaryText)
                .lineLimit(1)
                .frame(width: 80)
        }
        .onTapGesture {
            NotificationCenter.default.post(name: .openFile, object: url)
        }
        .onAppear {
            loadThumbnail()
        }
    }
    
    private func loadThumbnail() {
        Task {
            do {
                let image = NSImage(contentsOf: url)
                await MainActor.run {
                    thumbnail = image
                }
            } catch {
                print("Failed to load thumbnail: \(error)")
            }
        }
    }
}

struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        TabView {
            GeneralSettingsView()
                .tabItem {
                    Label("General", systemImage: "gear")
                }
            
            ImageSettingsView()
                .tabItem {
                    Label("Images", systemImage: "photo")
                }
            
            AISettingsView()
                .tabItem {
                    Label("AI Features", systemImage: "brain.head.profile")
                }
            
            AdvancedSettingsView()
                .tabItem {
                    Label("Advanced", systemImage: "slider.horizontal.3")
                }
        }
        .frame(width: 500, height: 400)
        .background(PicMobTheme.sidebarBackground)
    }
}

struct GeneralSettingsView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        Form {
            Section("Appearance") {
                Toggle("Show thumbnail strip", isOn: $appState.showThumbnailStrip)
                
                HStack {
                    Text("Default zoom level:")
                    Slider(value: $appState.defaultZoomLevel, in: 0.1...5.0, step: 0.1)
                        .accentColor(PicMobTheme.goldAccent)
                    Text("\(Int(appState.defaultZoomLevel * 100))%")
                        .frame(width: 50)
                }
            }
            
            Section("Behavior") {
                Toggle("Auto-enhance images", isOn: $appState.autoEnhanceImages)
            }
        }
        .padding()
        .background(PicMobTheme.sidebarBackground)
        .onChange(of: appState.showThumbnailStrip) { _ in
            appState.saveUserPreferences()
        }
        .onChange(of: appState.defaultZoomLevel) { _ in
            appState.saveUserPreferences()
        }
        .onChange(of: appState.autoEnhanceImages) { _ in
            appState.saveUserPreferences()
        }
    }
}

struct ImageSettingsView: View {
    var body: some View {
        Form {
            Section("Supported Formats") {
                Text("PicMob supports 50+ image formats including:")
                    .foregroundColor(PicMobTheme.mutedText)
                
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4)) {
                    ForEach(ImageFormat.allCases.prefix(20), id: \.self) { format in
                        Text(format.rawValue.uppercased())
                            .font(.caption)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(PicMobTheme.goldAccent.opacity(0.2))
                            .cornerRadius(4)
                    }
                }
            }
        }
        .padding()
        .background(PicMobTheme.sidebarBackground)
    }
}

struct AISettingsView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        Form {
            Section("AI Features") {
                Toggle("Enable AI features", isOn: $appState.enableAIFeatures)
                
                if appState.enableAIFeatures {
                    Text("AI features include upscaling, object removal, and image enhancement.")
                        .foregroundColor(PicMobTheme.mutedText)
                        .font(.caption)
                } else {
                    Text("AI features are disabled. Some functionality may be limited.")
                        .foregroundColor(.orange)
                        .font(.caption)
                }
            }
        }
        .padding()
        .background(PicMobTheme.sidebarBackground)
        .onChange(of: appState.enableAIFeatures) { _ in
            appState.saveUserPreferences()
        }
    }
}

struct AdvancedSettingsView: View {
    var body: some View {
        Form {
            Section("Performance") {
                HStack {
                    Text("Memory usage optimization:")
                    Spacer()
                    Text("Enabled")
                        .foregroundColor(PicMobTheme.goldAccent)
                }
                
                HStack {
                    Text("GPU acceleration:")
                    Spacer()
                    Text("Enabled")
                        .foregroundColor(PicMobTheme.goldAccent)
                }
                
                HStack {
                    Text("Multi-threading:")
                    Spacer()
                    Text("Enabled")
                        .foregroundColor(PicMobTheme.goldAccent)
                }
            }
            
            Section("About") {
                HStack {
                    Text("Version:")
                    Spacer()
                    Text("1.0.0")
                        .foregroundColor(PicMobTheme.mutedText)
                }
                
                HStack {
                    Text("Build:")
                    Spacer()
                    Text("2025.01.01")
                        .foregroundColor(PicMobTheme.mutedText)
                }
                
                Button("Check for Updates") {
                    // Implementation for update checking
                }
                .buttonStyle(PicMobButtonStyle())
            }
        }
        .padding()
        .background(PicMobTheme.sidebarBackground)
    }
}

#Preview {
    WelcomeView()
        .environmentObject(AppState())
        .frame(width: 800, height: 600)
}

