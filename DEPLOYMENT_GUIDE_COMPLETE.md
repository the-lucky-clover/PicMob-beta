# PicMob - Complete Deployment Guide

## 🚀 Overview
This guide covers deploying PicMob across all platforms:
- **Web**: Cloudflare Pages + Workers (FREE tier)
- **iOS/macOS**: App Store submission
- **Windows**: Microsoft Store submission

## 🌐 Cloudflare Deployment (FREE Tier)

### Prerequisites
1. Cloudflare account (free)
2. Domain name (optional, can use *.pages.dev subdomain)
3. Node.js 18+ installed locally

### Step 1: Set Up Cloudflare Infrastructure

#### 1.1 Create D1 Database
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create production database
wrangler d1 create picmob-prod

# Create development database
wrangler d1 create picmob-dev

# Note the database IDs and update wrangler.toml
```

#### 1.2 Create R2 Bucket
```bash
# Create production bucket
wrangler r2 bucket create picmob-images-prod

# Create development bucket
wrangler r2 bucket create picmob-images-dev
```

#### 1.3 Create KV Namespace
```bash
# Create production KV namespace
wrangler kv:namespace create "SESSIONS"

# Create development KV namespace
wrangler kv:namespace create "SESSIONS" --preview

# Note the namespace IDs and update wrangler.toml
```

#### 1.4 Update Configuration
Edit `wrangler.toml` with your actual IDs:
```toml
[[env.production.d1_databases]]
binding = "DB"
database_name = "picmob-prod"
database_id = "your-actual-database-id"

[[env.production.r2_buckets]]
binding = "IMAGES"
bucket_name = "picmob-images-prod"

[[env.production.kv_namespaces]]
binding = "SESSIONS"
id = "your-actual-kv-namespace-id"
```

### Step 2: Deploy Database Schema
```bash
# Deploy to development
wrangler d1 execute picmob-dev --file=./schema.sql

# Deploy to production
wrangler d1 execute picmob-prod --file=./schema.sql
```

### Step 3: Deploy Worker API
```bash
# Install dependencies
npm install

# Deploy to development
wrangler deploy --env development

# Deploy to production
wrangler deploy --env production
```

### Step 4: Deploy Web Frontend
1. Go to Cloudflare Dashboard > Pages
2. Connect your GitHub repository
3. Set build settings:
   - Build command: `echo 'Static site'`
   - Build output directory: `web`
4. Add environment variables if needed
5. Deploy

### Step 5: Configure Custom Domain (Optional)
1. Add your domain to Cloudflare
2. In Pages settings, add custom domain
3. Update DNS records as instructed

## 📱 iOS/macOS App Store Preparation

### Step 1: Update Project Configuration

#### 1.1 Update Bundle Identifier
In Xcode project settings:
- Change bundle identifier to your registered App ID
- Ensure it matches your Apple Developer account

#### 1.2 Update App Information
Create `Info.plist` with required fields:
- CFBundleDisplayName
- CFBundleShortVersionString
- CFBundleVersion
- LSMinimumSystemVersion
- Privacy usage descriptions

#### 1.3 Update Entitlements
Ensure `PicMob.entitlements` includes necessary permissions:
- App Sandbox
- Network access
- Photo library access
- Camera access

### Step 2: Code Signing and Provisioning

#### 2.1 Create App ID
1. Go to Apple Developer Portal
2. Create new App ID with bundle identifier
3. Enable necessary capabilities (Photo Library, Camera, etc.)

#### 2.2 Create Provisioning Profiles
```bash
# Development profile
1. Create development provisioning profile
2. Download and install in Xcode

# Distribution profile
1. Create App Store distribution profile
2. Download and install in Xcode
```

#### 2.3 Configure Xcode Project
1. Select development team
2. Choose correct provisioning profiles
3. Ensure code signing is set to automatic

### Step 3: Build and Test

#### 3.1 Test Locally
```bash
# Build and run on local device
1. Connect iOS device or use Simulator
2. Build and run from Xcode
3. Test all functionality
```

#### 3.2 Archive Build
```bash
# Create archive for App Store
1. In Xcode: Product > Archive
2. Wait for build to complete
3. Validate archive in Organizer
```

### Step 4: App Store Submission

#### 4.1 Prepare App Store Connect
1. Create new app in App Store Connect
2. Fill in app information:
   - Name: PicMob
   - Category: Photo & Video
   - Age rating: 4+ (or appropriate)
   - Keywords: photo sharing, social media, photography
   - Description: (see marketing copy below)

#### 4.2 Upload Build
1. From Xcode Organizer: Distribute App
2. Choose App Store Connect
3. Upload to App Store Connect
4. Wait for processing

#### 4.3 Submit for Review
1. Select uploaded build in App Store Connect
2. Complete all required fields
3. Submit for review

### Step 5: Marketing Assets

#### 5.1 App Store Screenshots (Required)
- iPhone 6.7": 1284×2778 pixels
- iPhone 6.5": 1242×2688 pixels  
- iPhone 5.5": 1242×2208 pixels
- iPad Pro (6th gen): 2048×2732 pixels
- iPad Pro (2nd gen): 2048×2732 pixels

#### 5.2 App Store Description
```
PicMob - Share Your World

Discover a new way to share and connect through photography. PicMob is a modern photo sharing platform that lets you:

✨ Share high-quality photos with friends and the world
🌍 Discover amazing content from creators globally  
🔒 Control your privacy with powerful security settings
⚡ Enjoy lightning-fast performance powered by global CDN
📱 Access your photos anywhere with cross-platform sync

Features:
• Upload and share photos in stunning quality
• Follow friends and discover new creators
• Like, comment, and engage with community content
• Organize photos with tags and collections
• Privacy controls for selective sharing
• Real-time notifications and updates
• Cross-platform synchronization

Perfect for:
• Photography enthusiasts
• Social media users
• Creative professionals
• Anyone who loves sharing moments

Download PicMob today and start sharing your world!
```

## 🖥️ Windows Store Preparation

### Step 1: Update Windows Project

#### 1.1 Update Package Manifest
Edit `Package.appxmanifest`:
```xml
<Identity Name="YourCompany.PicMob" 
          Publisher="CN=YourCompany" 
          Version="1.0.0.0" />

<Properties>
  <DisplayName>PicMob</DisplayName>
  <PublisherDisplayName>Your Company</PublisherDisplayName>
  <Description>Modern photo sharing platform</Description>
</Properties>

<Capabilities>
  <Capability Name="internetClient" />
  <Capability Name="picturesLibrary" />
  <Capability Name="webcam" />
</Capabilities>
```

#### 1.2 Create Store Assets
Required image sizes:
- Square 150x150 Logo: 150×150
- Square 44x44 Logo: 44×44  
- Store Logo: 50×50
- Wide 310x150 Logo: 310×150
- Square 310x310 Logo: 310×310

### Step 2: Build and Package

#### 2.1 Create Package
```bash
# In Visual Studio:
1. Right-click project > Publish > Create App Packages
2. Choose "Microsoft Store" distribution
3. Complete package wizard
4. Build package
```

#### 2.2 Test Package
```bash
# Install and test locally:
1. Enable Developer Mode in Windows Settings
2. Install .appx package
3. Test all functionality
```

### Step 3: Microsoft Partner Center Submission

#### 3.1 Create App Listing
1. Go to Microsoft Partner Center
2. Create new app submission
3. Fill in app details:
   - Name: PicMob
   - Category: Photo & Video
   - Age rating: Everyone
   - Features: Camera, Photo Library

#### 3.2 Upload Package
1. Upload .appxupload file
2. Complete certification notes
3. Submit for certification

## 🔧 Configuration & Environment Variables

### Cloudflare Worker Environment Variables
```bash
# Set production secrets
wrangler secret put JWT_SECRET --env production
wrangler secret put EMAIL_API_KEY --env production

# Set development secrets  
wrangler secret put JWT_SECRET --env development
wrangler secret put EMAIL_API_KEY --env development
```

### iOS App Configuration
Update API endpoints in app to point to your deployed worker:
```swift
struct APIConfig {
    static let baseURL = "https://your-worker-domain.workers.dev"
    static let webURL = "https://picmob.com"
}
```

### Windows App Configuration
Update API endpoints in Windows app configuration.

## 🚦 Free Tier Limits & Monitoring

### Cloudflare Free Tier Limits
- **Workers**: 100,000 requests/day
- **Pages**: Unlimited bandwidth
- **D1**: 25GB storage, 25M reads/day, 50K writes/day
- **R2**: 10GB storage, 1M Class A operations/month
- **KV**: 10GB storage, 10M reads/day

### Monitoring Setup
1. Enable Cloudflare Analytics
2. Set up alerts for approaching limits
3. Monitor error rates and performance
4. Use Real User Monitoring (RUM) for web performance

## 📋 Pre-Launch Checklist

### Technical
- [ ] All APIs deployed and tested
- [ ] Database schema deployed
- [ ] Web frontend deployed  
- [ ] iOS app builds and runs
- [ ] Windows app builds and runs
- [ ] Cross-platform data sync working
- [ ] Image upload/storage working
- [ ] User authentication working
- [ ] Profile pages functional (picmob.com/username)

### App Store Requirements
- [ ] App metadata complete
- [ ] Screenshots prepared for all devices
- [ ] App icons created and included
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Age rating completed
- [ ] In-app purchase setup (if applicable)

### Legal & Compliance  
- [ ] Privacy policy covers all data usage
- [ ] Terms of service comprehensive
- [ ] GDPR compliance measures in place
- [ ] Content moderation policies defined
- [ ] Copyright/DMCA procedures established

### Marketing
- [ ] App Store descriptions optimized
- [ ] Keywords researched and included
- [ ] Social media accounts created
- [ ] Landing page optimized for SEO
- [ ] Press kit prepared

## 🛟 Troubleshooting

### Common Issues

#### Worker Deployment Fails
```bash
# Check authentication
wrangler whoami

# Check configuration
wrangler tail --env production

# Validate schema
wrangler d1 execute picmob-prod --command "SELECT name FROM sqlite_master WHERE type='table'"
```

#### iOS Build Issues
- Ensure provisioning profiles are valid
- Check bundle identifier matches App ID
- Verify all entitlements are approved
- Update Xcode to latest version

#### Database Connection Issues
- Verify database binding in wrangler.toml
- Check D1 database exists and schema is deployed
- Ensure API endpoints are correctly configured

### Performance Optimization
1. **Images**: Use Cloudflare Images service for better optimization
2. **Caching**: Implement proper cache headers
3. **CDN**: Leverage Cloudflare's global network
4. **Database**: Add indexes for frequently queried fields
5. **API**: Implement rate limiting and request optimization

## 📈 Post-Launch Monitoring

### Analytics Setup
1. Google Analytics for web traffic
2. App Store Connect analytics for iOS
3. Microsoft Partner Center analytics for Windows
4. Cloudflare Analytics for API performance

### User Feedback
1. App Store reviews monitoring
2. In-app feedback mechanisms
3. Social media monitoring
4. Support ticket system

### Scaling Plan
1. Monitor free tier usage
2. Plan for paid tier upgrade when needed
3. Optimize database queries for efficiency
4. Implement caching strategies
5. Consider CDN optimization for images

This comprehensive guide should get PicMob deployed across all platforms using Cloudflare's free tier while ensuring App Store readiness.