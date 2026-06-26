//
//  ContentView.swift
//  PicMob
//
//  Created by PicMob Team.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var imageService = ImageService()
    @State private var selectedImage: ImageInfo?
    @State private var showingSidebar = true
    
    var body: some View {
        NavigationSplitView {
            // Sidebar with folder browser and recent files
            SidebarView(selectedImage: $selectedImage)
                .frame(minWidth: 200, idealWidth: 250, maxWidth: 300)
                .background(PicMobTheme.sidebarBackground)
        } detail: {
            // Main image viewer area
            if let image = selectedImage {
                ImageViewerView(image: image)
                    .background(PicMobTheme.viewerBackground)
                    .toolbar {
                        ToolbarItemGroup(placement: .primaryAction) {
                            ViewerToolbar(image: image)
                        }
                    }
            } else {
                WelcomeView()
                    .background(PicMobTheme.viewerBackground)
            }
        }
        .navigationSplitViewStyle(.balanced)
        .background(PicMobTheme.primaryBackground)
        .onDrop(of: [.fileURL], isTargeted: nil) { providers in
            handleFileDrop(providers)
        }
        .environmentObject(imageService)
        .onReceive(NotificationCenter.default.publisher(for: .openFile)) { notification in
            if let url = notification.object as? URL {
                Task {
                    await loadImage(from: url)
                }
            }
        }
    }
    
    private func handleFileDrop(_ providers: [NSItemProvider]) -> Bool {
        for provider in providers {
            provider.loadItem(forTypeIdentifier: "public.file-url", options: nil) { item, error in
                if let data = item as? Data,
                   let url = URL(dataRepresentation: data, relativeTo: nil) {
                    Task {
                        await loadImage(from: url)
                    }
                }
            }
        }
        return true
    }
    
    private func loadImage(from url: URL) async {
        do {
            let imageInfo = try await imageService.loadImage(from: url)
            await MainActor.run {
                selectedImage = imageInfo
                appState.currentImage = imageInfo
                appState.addRecentFile(url)
            }
        } catch {
            await MainActor.run {
                appState.errorMessage = "Failed to load image: \(error.localizedDescription)"
            }
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
}

