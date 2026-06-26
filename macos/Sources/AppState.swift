//
//  AppState.swift
//  PicMob
//
//  Created by PicMob Team.
//

import Foundation
import SwiftUI

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
        if UserDefaults.standard.object(forKey: "ShowThumbnailStrip") == nil {
            showThumbnailStrip = true
        }
        if UserDefaults.standard.object(forKey: "EnableAIFeatures") == nil {
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

