//
//  PicMobApp.swift
//  PicMob
//
//  Created by PicMob Team on 2025-01-01.
//  Copyright © 2025 PicMob Team. All rights reserved.
//

import SwiftUI
import AppKit

@main
struct PicMobApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .preferredColorScheme(.dark) // Mafia edge dark theme
                .background(PicMobTheme.primaryBackground)
        }
        .windowStyle(.hiddenTitleBar)
        .windowToolbarStyle(.unified(showsTitle: false))
        .commands {
            PicMobCommands()
        }
        
        Settings {
            SettingsView()
                .environmentObject(appState)
        }
    }
}

class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationDidFinishLaunching(_ notification: Notification) {
        // Configure app appearance for mafia edge theme
        NSApp.appearance = NSAppearance(named: .darkAqua)
        
        // Set up file associations
        setupFileAssociations()
        
        // Initialize AI models
        Task {
            await AIModelManager.shared.loadModels()
        }
        
        // Configure window appearance
        configureWindowAppearance()
    }
    
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
    
    func application(_ sender: NSApplication, openFile filename: String) -> Bool {
        // Handle file opening from Finder
        let url = URL(fileURLWithPath: filename)
        NotificationCenter.default.post(name: .openFile, object: url)
        return true
    }
    
    private func setupFileAssociations() {
        // Register supported file types
        let supportedTypes = ImageFormat.allCases.map { $0.uti }
        
        // Configure document types in Info.plist
        // This is handled in the Info.plist file
    }
    
    private func configureWindowAppearance() {
        // Set up custom window styling for mafia edge theme
        if let window = NSApp.windows.first {
            window.titlebarAppearsTransparent = true
            window.titleVisibility = .hidden
            window.backgroundColor = NSColor(PicMobTheme.primaryBackground)
        }
    }
}

// MARK: - App State Management
@MainActor
class AppState: ObservableObject {
    @Published var currentImage: ImageInfo?
    @Published var recentFiles: [URL] = []
    @Published var selectedFolder: URL?
    @Published var isProcessing: Bool = false
    @Published var processingProgress: Double = 0.0
    @Published var errorMessage: String?
    @Published var showingSettings: Bool = false
    
    // User preferences
    @Published var autoEnhanceImages: Bool = false
    @Published var defaultZoomLevel: Double = 1.0
    @Published var showThumbnailStrip: Bool = true
    @Published var enableAIFeatures: Bool = true
    
    init() {
        loadRecentFiles()
        loadUserPreferences()
    }
    
    func addRecentFile(_ url: URL) {
        recentFiles.removeAll { $0 == url }
        recentFiles.insert(url, at: 0)
        
        // Keep only the last 10 recent files
        if recentFiles.count > 10 {
            recentFiles = Array(recentFiles.prefix(10))
        }
        
        saveRecentFiles()
    }
    
    private func loadRecentFiles() {
        if let data = UserDefaults.standard.data(forKey: "RecentFiles"),
           let urls = try? JSONDecoder().decode([URL].self, from: data) {
            recentFiles = urls
        }
    }
    
    private func saveRecentFiles() {
        if let data = try? JSONEncoder().encode(recentFiles) {
            UserDefaults.standard.set(data, forKey: "RecentFiles")
        }
    }
    
    private func loadUserPreferences() {
        autoEnhanceImages = UserDefaults.standard.bool(forKey: "AutoEnhanceImages")
        defaultZoomLevel = UserDefaults.standard.double(forKey: "DefaultZoomLevel")
        showThumbnailStrip = UserDefaults.standard.bool(forKey: "ShowThumbnailStrip")
        enableAIFeatures = UserDefaults.standard.bool(forKey: "EnableAIFeatures")
        
        // Set defaults if not previously set
        if defaultZoomLevel == 0 {
            defaultZoomLevel = 1.0
        }
        if !UserDefaults.standard.object(forKey: "ShowThumbnailStrip") {
            showThumbnailStrip = true
        }
        if !UserDefaults.standard.object(forKey: "EnableAIFeatures") {
            enableAIFeatures = true
        }
    }
    
    func saveUserPreferences() {
        UserDefaults.standard.set(autoEnhanceImages, forKey: "AutoEnhanceImages")
        UserDefaults.standard.set(defaultZoomLevel, forKey: "DefaultZoomLevel")
        UserDefaults.standard.set(showThumbnailStrip, forKey: "ShowThumbnailStrip")
        UserDefaults.standard.set(enableAIFeatures, forKey: "EnableAIFeatures")
    }
}

// MARK: - Menu Commands
struct PicMobCommands: Commands {
    var body: some Commands {
        CommandGroup(after: .newItem) {
            Button("Open Image...") {
                openImageFile()
            }
            .keyboardShortcut("o", modifiers: .command)
            
            Button("Open Folder...") {
                openFolder()
            }
            .keyboardShortcut("o", modifiers: [.command, .shift])
        }
        
        CommandGroup(after: .importExport) {
            Button("Export Image...") {
                exportCurrentImage()
            }
            .keyboardShortcut("e", modifiers: .command)
            
            Divider()
            
            Button("Batch Process...") {
                showBatchProcessor()
            }
            .keyboardShortcut("b", modifiers: [.command, .shift])
        }
        
        CommandMenu("Image") {
            Button("Zoom In") {
                zoomIn()
            }
            .keyboardShortcut("+", modifiers: .command)
            
            Button("Zoom Out") {
                zoomOut()
            }
            .keyboardShortcut("-", modifiers: .command)
            
            Button("Actual Size") {
                actualSize()
            }
            .keyboardShortcut("0", modifiers: .command)
            
            Button("Fit to Window") {
                fitToWindow()
            }
            .keyboardShortcut("9", modifiers: .command)
            
            Divider()
            
            Button("Rotate Left") {
                rotateLeft()
            }
            .keyboardShortcut("l", modifiers: [.command, .option])
            
            Button("Rotate Right") {
                rotateRight()
            }
            .keyboardShortcut("r", modifiers: [.command, .option])
            
            Divider()
            
            Button("AI Upscale 2x") {
                aiUpscale(factor: 2)
            }
            .keyboardShortcut("2", modifiers: [.command, .shift])
            
            Button("AI Upscale 4x") {
                aiUpscale(factor: 4)
            }
            .keyboardShortcut("4", modifiers: [.command, .shift])
        }
        
        CommandGroup(after: .help) {
            Button("PicMob Help") {
                showHelp()
            }
            .keyboardShortcut("?", modifiers: .command)
            
            Button("Report Issue") {
                reportIssue()
            }
            
            Button("Join Beta Program") {
                joinBeta()
            }
        }
    }
    
    private func openImageFile() {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false
        panel.canChooseFiles = true
        panel.allowedContentTypes = ImageFormat.allCases.compactMap { $0.contentType }
        
        if panel.runModal() == .OK, let url = panel.url {
            NotificationCenter.default.post(name: .openFile, object: url)
        }
    }
    
    private func openFolder() {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        
        if panel.runModal() == .OK, let url = panel.url {
            NotificationCenter.default.post(name: .openFolder, object: url)
        }
    }
    
    private func exportCurrentImage() {
        NotificationCenter.default.post(name: .exportImage, object: nil)
    }
    
    private func showBatchProcessor() {
        NotificationCenter.default.post(name: .showBatchProcessor, object: nil)
    }
    
    private func zoomIn() {
        NotificationCenter.default.post(name: .zoomIn, object: nil)
    }
    
    private func zoomOut() {
        NotificationCenter.default.post(name: .zoomOut, object: nil)
    }
    
    private func actualSize() {
        NotificationCenter.default.post(name: .actualSize, object: nil)
    }
    
    private func fitToWindow() {
        NotificationCenter.default.post(name: .fitToWindow, object: nil)
    }
    
    private func rotateLeft() {
        NotificationCenter.default.post(name: .rotateLeft, object: nil)
    }
    
    private func rotateRight() {
        NotificationCenter.default.post(name: .rotateRight, object: nil)
    }
    
    private func aiUpscale(factor: Int) {
        NotificationCenter.default.post(name: .aiUpscale, object: factor)
    }
    
    private func showHelp() {
        if let url = URL(string: "https://picmob.app/help") {
            NSWorkspace.shared.open(url)
        }
    }
    
    private func reportIssue() {
        if let url = URL(string: "https://picmob.app/support") {
            NSWorkspace.shared.open(url)
        }
    }
    
    private func joinBeta() {
        if let url = URL(string: "https://picmob.app/beta") {
            NSWorkspace.shared.open(url)
        }
    }
}

// MARK: - Settings View
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
                    Text("\(Int(appState.defaultZoomLevel * 100))%")
                        .frame(width: 50)
                }
            }
            
            Section("Behavior") {
                Toggle("Auto-enhance images", isOn: $appState.autoEnhanceImages)
            }
        }
        .padding()
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
                    .foregroundColor(.secondary)
                
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
                        .foregroundColor(.secondary)
                        .font(.caption)
                } else {
                    Text("AI features are disabled. Some functionality may be limited.")
                        .foregroundColor(.orange)
                        .font(.caption)
                }
            }
        }
        .padding()
        .onChange(of: appState.enableAIFeatures) { _ in
            appState.saveUserPreferences()
        }
    }
}

struct AdvancedSettingsView: View {
    var body: some View {
        Form {
            Section("Performance") {
                Text("Memory usage optimization: Enabled")
                Text("GPU acceleration: Enabled")
                Text("Multi-threading: Enabled")
            }
            
            Section("About") {
                HStack {
                    Text("Version:")
                    Spacer()
                    Text("1.0.0")
                        .foregroundColor(.secondary)
                }
                
                HStack {
                    Text("Build:")
                    Spacer()
                    Text("2025.01.01")
                        .foregroundColor(.secondary)
                }
                
                Button("Check for Updates") {
                    // Implementation for update checking
                }
            }
        }
        .padding()
    }
}

// MARK: - Notification Names
extension Notification.Name {
    static let openFile = Notification.Name("openFile")
    static let openFolder = Notification.Name("openFolder")
    static let exportImage = Notification.Name("exportImage")
    static let showBatchProcessor = Notification.Name("showBatchProcessor")
    static let zoomIn = Notification.Name("zoomIn")
    static let zoomOut = Notification.Name("zoomOut")
    static let actualSize = Notification.Name("actualSize")
    static let fitToWindow = Notification.Name("fitToWindow")
    static let rotateLeft = Notification.Name("rotateLeft")
    static let rotateRight = Notification.Name("rotateRight")
    static let aiUpscale = Notification.Name("aiUpscale")
}

// MARK: - AI Model Manager
class AIModelManager {
    static let shared = AIModelManager()
    
    private init() {}
    
    func loadModels() async {
        // Load AI models for upscaling and object removal
        // This would be implemented with actual model loading
        print("Loading AI models...")
        
        // Simulate model loading time
        try? await Task.sleep(nanoseconds: 2_000_000_000) // 2 seconds
        
        print("AI models loaded successfully")
    }
}

