# PicMob macOS - Build Instructions

## 🚀 Quick Start Guide

### Prerequisites
- macOS Ventura 13.0 or later
- Xcode 15.0 or later
- Apple Developer Account ($99/year)

### Step 1: Create Xcode Project

1. **Open Xcode**
2. **Create a new project:**
   - File > New > Project
   - Select "macOS" > "App"
   - Click "Next"

3. **Configure project:**
   ```
   Product Name: PicMob
   Team: [Your Apple Developer Team]
   Organization Identifier: com.yourcompany.picmob
   Bundle Identifier: com.yourcompany.picmob
   Language: Swift
   Interface: SwiftUI
   Use Core Data: ✅
   Include Tests: ✅
   ```

4. **Choose location and create**

### Step 2: Copy Source Files

1. **Copy all files from `PicMob/Sources/PicMob/` to your Xcode project**
2. **Maintain the folder structure:**
   ```
   PicMob/
   ├── PicMobApp.swift
   ├── ContentView.swift
   ├── Core/
   │   ├── Models/
   │   └── Services/
   ├── UI/
   │   ├── Views/
   │   └── Styles/
   ├── ImageProcessing/
   │   └── AI/
   └── Platform/
   ```

3. **Add files to Xcode:**
   - Drag and drop the folders into your Xcode project
   - Choose "Create groups" when prompted
   - Ensure "Add to target" is checked for PicMob

### Step 3: Configure Project Settings

1. **General Tab:**
   ```
   Display Name: PicMob
   Bundle Identifier: com.yourcompany.picmob
   Version: 1.0
   Build: 1
   Deployment Target: macOS 13.0
   ```

2. **Signing & Capabilities:**
   - ✅ Automatically manage signing
   - Select your development team
   - Add capabilities:
     - ✅ App Sandbox
     - ✅ Hardened Runtime
     - ✅ File Access (User Selected Files - Read/Write)
     - ✅ Outgoing Connections (Client)

3. **Info.plist Configuration:**
   Add supported document types:
   ```xml
   <key>CFBundleDocumentTypes</key>
   <array>
       <dict>
           <key>CFBundleTypeName</key>
           <string>Images</string>
           <key>CFBundleTypeRole</key>
           <string>Editor</string>
           <key>LSItemContentTypes</key>
           <array>
               <string>public.image</string>
               <string>public.jpeg</string>
               <string>public.png</string>
               <string>public.tiff</string>
               <string>public.heic</string>
               <string>com.adobe.raw-image</string>
               <string>com.adobe.photoshop-image</string>
           </array>
       </dict>
   </array>
   ```

### Step 4: Add Dependencies

1. **File > Add Package Dependencies**
2. **Add these packages:**
   ```
   https://github.com/apple/swift-algorithms
   https://github.com/apple/swift-collections
   https://github.com/apple/swift-log
   https://github.com/apple/swift-numerics
   ```

### Step 5: Build and Test

1. **Build the project:**
   - Press `⌘+B` to build
   - Fix any compilation errors

2. **Run the project:**
   - Press `⌘+R` to run
   - Test basic functionality

### Step 6: Add App Icon

1. **Create app icon set:**
   - Design a crown icon with gold/black theme
   - Export in required sizes: 16x16, 32x32, 128x128, 256x256, 512x512, 1024x1024

2. **Add to project:**
   - Select Assets.xcassets in Xcode
   - Drag icon files to AppIcon slots

## 🔧 Advanced Configuration

### Performance Optimizations

1. **Build Settings:**
   ```
   SWIFT_COMPILATION_MODE = wholemodule
   SWIFT_OPTIMIZATION_LEVEL = -O
   GCC_OPTIMIZATION_LEVEL = fast
   ```

2. **Linker Flags:**
   ```
   OTHER_LDFLAGS = -Wl,-sectcreate,__TEXT,__info_plist,Info.plist
   ```

### Code Signing for Distribution

1. **Create Distribution Certificate:**
   - Visit Apple Developer portal
   - Create "Mac App Distribution" certificate
   - Download and install in Keychain

2. **Create App Store Provisioning Profile:**
   - Create new provisioning profile
   - Select "Mac App Store" distribution
   - Download and install

3. **Configure Xcode:**
   - Select "Manual" signing
   - Choose distribution certificate
   - Select App Store provisioning profile

## 📦 Building for Release

### Archive Build

1. **Set scheme to "Any Mac"**
2. **Product > Archive**
3. **Wait for build to complete**

### Export for App Store

1. **In Organizer, select your archive**
2. **Click "Distribute App"**
3. **Choose "Mac App Store Connect"**
4. **Follow export wizard**

### Command Line Build

```bash
# Debug build
xcodebuild -project PicMob.xcodeproj -scheme PicMob -configuration Debug build

# Release build
xcodebuild -project PicMob.xcodeproj -scheme PicMob -configuration Release -archivePath build/PicMob.xcarchive archive

# Export for App Store
xcodebuild -exportArchive -archivePath build/PicMob.xcarchive -exportPath build/export -exportOptionsPlist ExportOptions.plist
```

## 🚨 Troubleshooting

### Common Build Errors

1. **"No such module" errors:**
   - Clean build folder: Product > Clean Build Folder
   - Reset package cache: File > Packages > Reset Package Caches

2. **Code signing errors:**
   - Verify Apple Developer account is active
   - Check certificate expiration dates
   - Regenerate provisioning profiles

3. **Swift compilation errors:**
   - Ensure all files are added to target
   - Check import statements
   - Verify Swift version compatibility

### Runtime Issues

1. **App crashes on launch:**
   - Check Console.app for crash logs
   - Verify all required frameworks are linked
   - Test with different macOS versions

2. **File association not working:**
   - Verify Info.plist document types
   - Check bundle identifier matches
   - Test with different file types

## 🎯 Testing Checklist

### Functionality Tests
- ✅ Image loading (various formats)
- ✅ Zoom and pan operations
- ✅ File drag and drop
- ✅ Menu commands
- ✅ Keyboard shortcuts
- ✅ Settings persistence
- ✅ Recent files management

### Performance Tests
- ✅ Large image handling (>50MP)
- ✅ Memory usage monitoring
- ✅ Loading speed benchmarks
- ✅ AI processing performance

### Compatibility Tests
- ✅ macOS Ventura 13.0
- ✅ macOS Sonoma 14.0
- ✅ Intel and Apple Silicon Macs
- ✅ Different screen resolutions

## 📱 App Store Submission

### Preparation
1. **Complete app metadata in App Store Connect**
2. **Upload screenshots (required sizes)**
3. **Write app description and keywords**
4. **Set pricing and availability**

### Submission Process
1. **Upload build via Xcode Organizer**
2. **Wait for processing (15-60 minutes)**
3. **Select build in App Store Connect**
4. **Submit for review**
5. **Monitor review status**

### Review Guidelines
- Ensure app follows macOS Human Interface Guidelines
- Test all features thoroughly
- Provide clear app description
- Include privacy policy if collecting data
- Respond promptly to reviewer feedback

## 💰 Monetization Strategy

### Pricing
- **Launch Price:** $9.99 (50% less than Pixea Plus)
- **Promotional Pricing:** $7.99 for first month
- **Target Revenue:** $75,000 in Year 1

### Marketing
- **App Store Optimization:** Focus on keywords like "image viewer", "RAW support", "AI upscaling"
- **Professional Photography Communities:** Target photographers and designers
- **Social Media:** Showcase "mafia edge" branding and superior performance

---

**Follow these instructions step by step to build and deploy PicMob successfully! 🏆**

