#!/bin/bash

# PicMob macOS - Automated Xcode Project Creation Script
# This script helps set up the PicMob Xcode project structure

set -e

echo "🏆 PicMob - Automated Xcode Project Setup"
echo "=========================================="

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: Xcode is not installed or not in PATH"
    echo "Please install Xcode from the Mac App Store"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "PicMob" ]; then
    echo "❌ Error: Please run this script from the PicMob-macOS-Complete directory"
    echo "Expected structure:"
    echo "  - README.md"
    echo "  - PicMob/"
    echo "  - build-instructions.md"
    exit 1
fi

echo "✅ Environment checks passed"

# Create Xcode project directory
PROJECT_NAME="PicMob"
PROJECT_DIR="${PROJECT_NAME}.xcodeproj"

if [ -d "$PROJECT_DIR" ]; then
    echo "⚠️  Warning: $PROJECT_DIR already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted by user"
        exit 1
    fi
    rm -rf "$PROJECT_DIR"
fi

echo "📁 Creating Xcode project structure..."

# Create basic Xcode project structure
mkdir -p "$PROJECT_DIR"

# Create a basic project.pbxproj file
cat > "$PROJECT_DIR/project.pbxproj" << 'EOF'
// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {

/* Begin PBXBuildFile section */
/* End PBXBuildFile section */

/* Begin PBXFileReference section */
/* End PBXFileReference section */

/* Begin PBXFrameworksBuildPhase section */
/* End PBXFrameworksBuildPhase section */

/* Begin PBXGroup section */
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
/* End PBXNativeTarget section */

/* Begin PBXProject section */
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
/* End PBXResourcesBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
/* End PBXSourcesBuildPhase section */

/* Begin XCBuildConfiguration section */
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
/* End XCConfigurationList section */
	};
	rootObject = 1A2B3C4D5E6F7886 /* Project object */;
}
EOF

echo "⚠️  Note: The generated project.pbxproj is a template."
echo "   You'll need to create a proper Xcode project manually."
echo ""
echo "📋 Next Steps:"
echo "1. Open Xcode"
echo "2. Create a new macOS App project with these settings:"
echo "   - Product Name: PicMob"
echo "   - Interface: SwiftUI"
echo "   - Language: Swift"
echo "   - Use Core Data: Yes"
echo "   - Include Tests: Yes"
echo ""
echo "3. Copy the source files from PicMob/Sources/PicMob/ to your new project"
echo "4. Follow the detailed instructions in build-instructions.md"
echo ""

# Create a helper script for copying files
cat > "copy-sources.sh" << 'EOF'
#!/bin/bash

# Helper script to copy PicMob sources to Xcode project
# Usage: ./copy-sources.sh /path/to/your/PicMob.xcodeproj

if [ $# -eq 0 ]; then
    echo "Usage: $0 /path/to/your/PicMob.xcodeproj"
    echo "Example: $0 ~/Development/PicMob/PicMob.xcodeproj"
    exit 1
fi

XCODE_PROJECT_DIR="$1"
XCODE_PROJECT_NAME=$(basename "$XCODE_PROJECT_DIR" .xcodeproj)
SOURCE_DIR="PicMob/Sources/PicMob"

if [ ! -d "$XCODE_PROJECT_DIR" ]; then
    echo "Error: Xcode project not found at $XCODE_PROJECT_DIR"
    exit 1
fi

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory not found at $SOURCE_DIR"
    exit 1
fi

# Find the project directory (should be next to .xcodeproj)
PROJECT_ROOT=$(dirname "$XCODE_PROJECT_DIR")
TARGET_DIR="$PROJECT_ROOT/$XCODE_PROJECT_NAME"

if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Target directory not found at $TARGET_DIR"
    echo "Make sure your Xcode project structure is correct"
    exit 1
fi

echo "Copying PicMob sources..."
echo "From: $SOURCE_DIR"
echo "To: $TARGET_DIR"

# Copy all source files while preserving structure
cp -R "$SOURCE_DIR"/* "$TARGET_DIR/"

echo "✅ Sources copied successfully!"
echo ""
echo "Next steps:"
echo "1. Open your Xcode project"
echo "2. Add the copied files to your project target"
echo "3. Configure project settings as described in build-instructions.md"
echo "4. Add Swift Package dependencies"
echo "5. Build and run!"

EOF

chmod +x copy-sources.sh

echo "📝 Created helper script: copy-sources.sh"
echo "   Use this to copy sources to your Xcode project after creation"
echo ""

# Create Info.plist template
cat > "Info.plist.template" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>PicMob</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>13.0</string>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.graphics-design</string>
    <key>NSHumanReadableCopyright</key>
    <string>Copyright © 2025 PicMob Team. All rights reserved.</string>
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
                <string>public.heif</string>
                <string>org.webmproject.webp</string>
                <string>com.adobe.raw-image</string>
                <string>com.adobe.photoshop-image</string>
                <string>com.canon.cr2-raw-image</string>
                <string>com.canon.cr3-raw-image</string>
                <string>com.nikon.raw-image</string>
                <string>com.sony.arw-raw-image</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
EOF

echo "📄 Created Info.plist template"
echo "   Use this as reference for configuring your app's Info.plist"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📚 Documentation created:"
echo "   - build-instructions.md (detailed build guide)"
echo "   - copy-sources.sh (helper script)"
echo "   - Info.plist.template (configuration template)"
echo ""
echo "🚀 Ready to build PicMob!"
echo "   Follow the instructions in build-instructions.md"
EOF

chmod +x create-xcode-project.sh

