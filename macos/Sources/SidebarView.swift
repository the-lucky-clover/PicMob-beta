//
//  SidebarView.swift
//  PicMob
//
//  Created by PicMob Team.
//

import SwiftUI
import AppKit
import UniformTypeIdentifiers

struct SidebarView: View {
    @Binding var selectedImage: ImageInfo?
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var imageService: ImageService
    @State private var selectedFolder: URL?
    @State private var folderImages: [URL] = []
    @State private var includeSubfolders: Bool = true
    @State private var filterType: String = "All"

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack {
                Button(action: openFolder) {
                    Label("Add Folder", systemImage: "folder.badge.plus")
                }
                .padding(.horizontal)
                Spacer()
                Toggle("Include Subfolders", isOn: $includeSubfolders)
                    .toggleStyle(SwitchToggleStyle())
                    .padding(.trailing)
            }
            Divider()

            // Filter
            Picker("Filter", selection: $filterType) {
                Text("All").tag("All")
                Text("Images").tag("Images")
                Text("Videos").tag("Videos")
                Text("Music").tag("Music")
                Text("Books").tag("Books")
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding(.horizontal)

            Divider()

            // Current Folder
            if let folder = selectedFolder {
                Text("Folder: \(folder.lastPathComponent)")
                    .font(.headline)
                    .padding(.horizontal)
                List(filteredFolderItems(), id: \.self) { url in
                    FolderImageRow(
                        url: url,
                        isSelected: selectedImage?.url == url,
                        onSelect: {
                            Task { await loadImage(from: url) }
                        }
                    )
                }
                .frame(minHeight: 100)
            }

            // Recent Files
            VStack(alignment: .leading, spacing: 8) {
                Text("Recent Files")
                    .font(.headline)
                    .padding(.horizontal)
                ForEach(appState.recentFiles, id: \.self) { url in
                    RecentFileRow(
                        url: url,
                        isSelected: selectedImage?.url == url,
                        onSelect: {
                            Task { await loadImage(from: url) }
                        }
                    )
                }
            }

            Spacer()

            // Status
            if appState.isProcessing {
                ProgressView(value: appState.processingProgress)
                    .padding(.horizontal)
            }
        }
        .background(PicMobTheme.sidebarBackground)
        .onDrop(of: [.fileURL], isTargeted: nil) { providers in
            handleDrop(providers)
        }
        .onReceive(NotificationCenter.default.publisher(for: .openFolder)) { notification in
            if let url = notification.object as? URL {
                selectedFolder = url
                appState.selectedFolder = url
                loadFolderImages(from: url)
            }
        }
    }

    private func openFolder() {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        panel.prompt = "Choose Folder"

        if panel.runModal() == .OK, let url = panel.url {
            selectedFolder = url
            appState.selectedFolder = url
            loadFolderImages(from: url)
        }
    }

    private func handleDrop(_ providers: [NSItemProvider]) -> Bool {
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

    private func loadFolderImages(from folder: URL) {
        Task {
            let allowed: Set<String> = [
                "jpg","jpeg","png","heic","heif","tif","tiff","gif","bmp","webp", // images
                "mp4","mov","avi","mkv", // videos
                "mp3","wav","flac","aac", // audio
                "pdf","epub" // ebooks
            ]
            var urls: [URL] = []
            if includeSubfolders {
                if let enumerator = FileManager.default.enumerator(at: folder, includingPropertiesForKeys: [.isRegularFileKey, .contentTypeKey], options: [.skipsHiddenFiles]) {
                    for case let url as URL in enumerator {
                        if allowed.contains(url.pathExtension.lowercased()) {
                            urls.append(url)
                        }
                    }
                }
            } else {
                let files = try? FileManager.default.contentsOfDirectory(
                    at: folder,
                    includingPropertiesForKeys: [.isRegularFileKey, .contentTypeKey],
                    options: [.skipsHiddenFiles, .skipsPackageDescendants]
                )
                urls = files?.filter { allowed.contains($0.pathExtension.lowercased()) } ?? []
            }
            await MainActor.run {
                folderImages = urls
            }
        }
    }

    private func filteredFolderItems() -> [URL] {
        switch filterType {
            case "Images":
                return folderImages.filter { $0.isImage }
            case "Videos":
                return folderImages.filter { $0.isVideo }
            case "Music":
                return folderImages.filter { $0.isAudio }
            case "Books":
                return folderImages.filter { $0.isBook }
            default:
                return folderImages
        }
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
                appState.errorMessage = "Failed to load item: \(error.localizedDescription)"
            }
        }
    }
}

// Helper extensions for media type detection
extension URL {
    var isImage: Bool {
        let exts = ["jpg","jpeg","png","heic","heif","tif","tiff","gif","bmp","webp"]
        return exts.contains(pathExtension.lowercased())
    }
    var isVideo: Bool {
        let exts = ["mp4","mov","avi","mkv"]
        return exts.contains(pathExtension.lowercased())
    }
    var isAudio: Bool {
        let exts = ["mp3","wav","flac","aac"]
        return exts.contains(pathExtension.lowercased())
    }
    var isBook: Bool {
        let exts = ["pdf","epub"]
        return exts.contains(pathExtension.lowercased())
    }
}

struct SidebarButton: View {
    let label: String
    let systemImage: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Label(label, systemImage: systemImage)
        }
        .padding(.vertical, 4)
        .padding(.horizontal)
    }
}

struct FolderImageRow: View {
    let url: URL
    let isSelected: Bool
    let onSelect: () -> Void

    var body: some View {
        Button(action: onSelect) {
            HStack {
                Image(systemName: iconName(for: url))
                    .frame(width: 16)
                    .foregroundColor(isSelected ? PicMobTheme.goldAccent : PicMobTheme.mutedText)
                VStack(alignment: .leading, spacing: 2) {
                    Text(url.lastPathComponent)
                        .font(.subheadline)
                        .foregroundColor(isSelected ? PicMobTheme.goldAccent : PicMobTheme.mutedText)
                    Text(url.path)
                        .font(.caption2)
                        .foregroundColor(PicMobTheme.mutedText)
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
    }

    private func iconName(for url: URL) -> String {
        if url.isImage { return "photo" }
        if url.isVideo { return "film" }
        if url.isAudio { return "music.note" }
        if url.isBook { return "book" }
        return "doc"
    }
}

struct RecentFileRow: View {
    let url: URL
    let isSelected: Bool
    let onSelect: () -> Void

    var body: some View {
        Button(action: onSelect) {
            HStack {
                Image(systemName: "clock")
                    .frame(width: 16)
                    .foregroundColor(isSelected ? PicMobTheme.goldAccent : PicMobTheme.mutedText)
                VStack(alignment: .leading, spacing: 2) {
                    Text(url.lastPathComponent)
                        .font(.subheadline)
                        .foregroundColor(isSelected ? PicMobTheme.goldAccent : PicMobTheme.mutedText)
                    Text(url.path)
                        .font(.caption2)
                        .foregroundColor(PicMobTheme.mutedText)
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// Optionally, add a preview for SwiftUI canvas
#Preview {
    SidebarView(selectedImage: .constant(nil))
        .environmentObject(AppState())
        .frame(width: 250, height: 600)
}

