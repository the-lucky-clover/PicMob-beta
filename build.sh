#!/bin/bash

# PicMob Build and Deployment Script
# This script handles building and deploying PicMob across all platforms

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
LOG_FILE="$BUILD_DIR/build.log"

# Create build directory
mkdir -p "$BUILD_DIR"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is required but not installed"
        exit 1
    fi
    
    # Check Wrangler
    if ! command -v wrangler &> /dev/null; then
        warning "Wrangler CLI not found, installing..."
        npm install -g wrangler
    fi
    
    # Check Xcode (macOS only)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if ! command -v xcodebuild &> /dev/null; then
            warning "Xcode not found - iOS/macOS builds will be skipped"
        fi
    fi
    
    log "Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$PROJECT_ROOT"
    
    # Install Node.js dependencies
    if [[ -f "package.json" ]]; then
        npm install
    fi
    
    # Install Swift Package dependencies (if needed)
    if [[ -f "Package.swift" ]]; then
        swift package resolve
    fi
    
    log "Dependencies installed"
}

# Build Cloudflare Worker
build_worker() {
    log "Building Cloudflare Worker..."
    
    cd "$PROJECT_ROOT"
    
    # Validate configuration
    if [[ ! -f "wrangler.toml" ]]; then
        error "wrangler.toml not found"
        exit 1
    fi
    
    # Run tests
    if [[ "$1" != "--skip-tests" ]]; then
        log "Running API tests..."
        npm test || {
            error "Tests failed"
            exit 1
        }
    fi
    
    # Deploy to development
    log "Deploying to development environment..."
    wrangler deploy --env development
    
    # Verify deployment
    log "Verifying deployment..."
    sleep 5
    
    DEV_URL=$(wrangler whoami | grep "development" || echo "")
    if [[ -n "$DEV_URL" ]]; then
        curl -f "$DEV_URL/health" || {
            error "Development deployment verification failed"
            exit 1
        }
        log "Development deployment verified"
    fi
    
    log "Worker build completed"
}

# Deploy database schema
deploy_database() {
    log "Deploying database schema..."
    
    cd "$PROJECT_ROOT"
    
    if [[ ! -f "schema.sql" ]]; then
        error "schema.sql not found"
        exit 1
    fi
    
    # Deploy to development database
    log "Deploying to development database..."
    wrangler d1 execute picmob-dev --file=./schema.sql
    
    log "Database deployment completed"
}

# Build web frontend
build_web() {
    log "Building web frontend..."
    
    cd "$PROJECT_ROOT"
    
    if [[ ! -d "web" ]]; then
        error "Web directory not found"
        exit 1
    fi
    
    # Copy web files to build directory
    cp -r web "$BUILD_DIR/"
    
    # Validate HTML
    if command -v htmlhint &> /dev/null; then
        htmlhint "$BUILD_DIR/web/index.html" || warning "HTML validation failed"
    fi
    
    log "Web build completed"
}

# Build iOS/macOS app
build_ios() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        warning "Skipping iOS build - macOS required"
        return
    fi
    
    if ! command -v xcodebuild &> /dev/null; then
        warning "Skipping iOS build - Xcode not found"
        return
    fi
    
    log "Building iOS/macOS app..."
    
    cd "$PROJECT_ROOT/PicMob"
    
    if [[ ! -f "PicMob.xcodeproj/project.pbxproj" ]]; then
        error "Xcode project not found"
        return
    fi
    
    # Clean build
    log "Cleaning Xcode build..."
    xcodebuild clean -project PicMob.xcodeproj -scheme PicMob
    
    # Build for simulator (development)
    log "Building for simulator..."
    xcodebuild build -project PicMob.xcodeproj -scheme PicMob -destination 'platform=iOS Simulator,name=iPhone 15'
    
    # Archive for distribution (if requested)
    if [[ "$1" == "--archive" ]]; then
        log "Creating archive for App Store..."
        xcodebuild archive -project PicMob.xcodeproj -scheme PicMob -archivePath "$BUILD_DIR/PicMob.xcarchive"
        
        if [[ -d "$BUILD_DIR/PicMob.xcarchive" ]]; then
            log "Archive created successfully"
        else
            error "Archive creation failed"
        fi
    fi
    
    log "iOS build completed"
}

# Build Windows app
build_windows() {
    if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "cygwin" ]]; then
        warning "Skipping Windows build - Windows required"
        return
    fi
    
    if ! command -v msbuild &> /dev/null; then
        warning "Skipping Windows build - MSBuild not found"
        return
    fi
    
    log "Building Windows app..."
    
    cd "$PROJECT_ROOT/PicMobWindows"
    
    if [[ ! -f "PicMobWindows.csproj" ]]; then
        error "Windows project not found"
        return
    fi
    
    # Clean and build
    msbuild PicMobWindows.csproj -t:Clean
    msbuild PicMobWindows.csproj -t:Build -p:Configuration=Release
    
    log "Windows build completed"
}

# Run security checks
security_check() {
    log "Running security checks..."
    
    cd "$PROJECT_ROOT"
    
    # Check for sensitive files
    if [[ -f ".env" ]]; then
        warning "Found .env file - ensure it's in .gitignore"
    fi
    
    # Check package vulnerabilities
    if command -v npm &> /dev/null && [[ -f "package.json" ]]; then
        npm audit --audit-level high || warning "npm audit found vulnerabilities"
    fi
    
    # Check for hardcoded secrets
    if command -v grep &> /dev/null; then
        SECRETS_FOUND=$(grep -r -i "password\|secret\|key\|token" src/ --exclude-dir=node_modules || true)
        if [[ -n "$SECRETS_FOUND" ]]; then
            warning "Potential hardcoded secrets found - please review"
        fi
    fi
    
    log "Security check completed"
}

# Deploy to production
deploy_production() {
    log "Deploying to production..."
    
    # Confirm production deployment
    read -p "Are you sure you want to deploy to production? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Production deployment cancelled"
        return
    fi
    
    cd "$PROJECT_ROOT"
    
    # Deploy worker to production
    log "Deploying worker to production..."
    wrangler deploy --env production
    
    # Deploy database schema to production (if needed)
    read -p "Deploy database schema to production? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        wrangler d1 execute picmob-prod --file=./schema.sql
    fi
    
    # Verify production deployment
    log "Verifying production deployment..."
    sleep 10
    
    # Test production endpoints
    PROD_URL="https://your-worker-domain.workers.dev"
    curl -f "$PROD_URL/health" || {
        error "Production deployment verification failed"
        exit 1
    }
    
    log "Production deployment completed successfully"
}

# Main function
main() {
    log "Starting PicMob build process..."
    
    # Parse command line arguments
    SKIP_TESTS=false
    ARCHIVE_IOS=false
    DEPLOY_PROD=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --archive)
                ARCHIVE_IOS=true
                shift
                ;;
            --production)
                DEPLOY_PROD=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --skip-tests    Skip running tests"
                echo "  --archive       Create iOS archive for App Store"
                echo "  --production    Deploy to production environment"
                echo "  --help          Show this help message"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run build steps
    check_prerequisites
    install_dependencies
    deploy_database
    
    if [[ "$SKIP_TESTS" == "true" ]]; then
        build_worker --skip-tests
    else
        build_worker
    fi
    
    build_web
    
    if [[ "$ARCHIVE_IOS" == "true" ]]; then
        build_ios --archive
    else
        build_ios
    fi
    
    build_windows
    security_check
    
    if [[ "$DEPLOY_PROD" == "true" ]]; then
        deploy_production
    fi
    
    log "Build process completed successfully!"
    log "Build artifacts available in: $BUILD_DIR"
    
    # Summary
    echo
    echo "=== Build Summary ==="
    echo "Log file: $LOG_FILE"
    echo "Build directory: $BUILD_DIR"
    echo "Next steps:"
    echo "1. Review build log for any warnings"
    echo "2. Test deployments in development environment"
    echo "3. Submit iOS app to App Store Connect (if archived)"
    echo "4. Deploy to production when ready (--production flag)"
}

# Run main function with all arguments
main "$@"