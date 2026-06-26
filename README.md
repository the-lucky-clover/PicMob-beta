# PicMob - Modern Photo Sharing Platform

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![iOS](https://img.shields.io/badge/iOS-14.0+-blue)](https://developer.apple.com/ios/)
[![macOS](https://img.shields.io/badge/macOS-13.0+-blue)](https://developer.apple.com/macos/)
[![Windows](https://img.shields.io/badge/Windows-10+-blue)](https://developer.microsoft.com/en-us/windows/)

**PicMob** is a comprehensive photo sharing social media platform that works across all devices and platforms. Share your world with friends, discover amazing content, and connect with photographers globally.

## 🌟 Features

### 🔥 Core Features
- **High-Quality Photo Sharing** - Upload and share photos in stunning quality
- **User Profiles** - Personalized profiles accessible via `picmob.com/username`
- **Social Interactions** - Like, comment, follow, and discover content
- **Cross-Platform Sync** - Seamless experience across iOS, macOS, Windows, and web
- **Real-Time Feeds** - Discover trending content and follow friends
- **Privacy Controls** - Granular privacy settings for content sharing

### ⚡ Technical Features
- **Global CDN** - Lightning-fast performance powered by Cloudflare
- **Serverless Architecture** - Scalable and cost-effective infrastructure
- **Offline Support** - Continue browsing with intelligent caching
- **Progressive Web App** - App-like experience in web browsers
- **End-to-End Encryption** - Secure photo storage and transmission

## 🏗️ Architecture

### Backend (Cloudflare Free Tier)
- **Cloudflare Workers** - Serverless API and authentication
- **Cloudflare D1** - SQLite database for user data and metadata
- **Cloudflare R2** - Object storage for photos and media
- **Cloudflare KV** - Session management and caching
- **Cloudflare Pages** - Web frontend hosting

### Frontend Applications
- **iOS/macOS** - Native SwiftUI applications
- **Windows** - Native WPF/.NET application  
- **Web** - Progressive Web App with vanilla JavaScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Cloudflare account (free)
- Apple Developer account (for iOS/macOS)
- Microsoft Developer account (for Windows Store)

### 1. Clone and Setup
```bash
git clone https://github.com/yourusername/picmob.git
cd picmob
npm install
```

### 2. Configure Cloudflare
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create infrastructure
wrangler d1 create picmob-dev
wrangler r2 bucket create picmob-images-dev
wrangler kv:namespace create "SESSIONS"

# Update wrangler.toml with your IDs
```

### 3. Deploy Database
```bash
wrangler d1 execute picmob-dev --file=./schema.sql
```

### 4. Deploy API
```bash
wrangler deploy --env development
```

### 5. Test Deployment
```bash
npm test
```

### 6. Build All Platforms
```bash
./build.sh --help
./build.sh  # Build all platforms
```

## 📱 Platform-Specific Setup

### iOS/macOS App Store
1. **Configure Xcode Project**
   - Update bundle identifier in project settings
   - Configure provisioning profiles and code signing
   - Update `Info.plist` with app information

2. **Build and Archive**
   ```bash
   ./build.sh --archive
   ```

3. **Submit to App Store**
   - Upload to App Store Connect
   - Complete app metadata and screenshots
   - Submit for review

### Windows Microsoft Store
1. **Configure Visual Studio Project**
   - Update `Package.appxmanifest` with app details
   - Configure store assets and icons
   - Set up package signing

2. **Build Package**
   ```bash
   # In Visual Studio
   Project > Publish > Create App Packages
   ```

3. **Submit to Microsoft Store**
   - Upload to Microsoft Partner Center
   - Complete app listing
   - Submit for certification

### Web (Cloudflare Pages)
1. **Connect Repository**
   - Link GitHub repository to Cloudflare Pages
   - Set build output directory to `web`

2. **Configure Custom Domain** (Optional)
   - Add domain to Cloudflare
   - Update DNS settings
   - Enable SSL/TLS

## 🔧 Configuration

### Environment Variables
```bash
# Development
JWT_SECRET=your-jwt-secret-here
EMAIL_API_KEY=your-email-service-key

# Production  
wrangler secret put JWT_SECRET --env production
wrangler secret put EMAIL_API_KEY --env production
```

### API Configuration
Update API endpoints in your applications:
- **Development**: `https://your-worker-dev.workers.dev`
- **Production**: `https://your-worker.workers.dev` or custom domain

### Database Configuration
The SQLite schema in `schema.sql` includes:
- Users and authentication
- Photo metadata and storage
- Social features (likes, comments, follows)
- Privacy and security settings

## 📊 Free Tier Limits

### Cloudflare Free Tier
- **Workers**: 100,000 requests/day
- **D1**: 25GB storage, 25M reads/day, 50K writes/day  
- **R2**: 10GB storage, 1M Class A operations/month
- **KV**: 10GB storage, 10M reads/day
- **Pages**: Unlimited bandwidth and requests

### Scaling Strategy
1. **Monitor Usage** - Set up alerts for approaching limits
2. **Optimize Queries** - Use efficient database queries and caching
3. **Image Optimization** - Compress and resize photos appropriately
4. **Upgrade Plan** - Move to paid tier when usage grows

## 🧪 Testing

### Run API Tests
```bash
npm test
```

### Run Integration Tests
```bash
wrangler dev  # Start local development server
npm run test:integration
```

### Load Testing
```bash
# Using k6 or similar tool
k6 run tests/load-test.js
```

## 📈 Monitoring and Analytics

### Cloudflare Analytics
- Real User Monitoring (RUM)
- Worker analytics and performance
- Security insights and threat detection

### Application Monitoring
- Error tracking and logging
- Performance monitoring
- User behavior analytics

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication
- Session management with KV store
- Role-based access control
- Rate limiting and abuse prevention

### Data Protection
- Encryption in transit and at rest
- GDPR and CCPA compliance
- Content moderation tools
- Privacy controls for users

### Security Headers
- Content Security Policy (CSP)
- CORS configuration
- XSS protection
- CSRF prevention

## 🌍 Deployment

### Development Environment
```bash
./build.sh
```

### Production Environment  
```bash
./build.sh --production
```

### CI/CD Pipeline
GitHub Actions workflow included for:
- Automated testing
- Security scanning
- Multi-platform builds
- Deployment to staging/production

## 📋 Pre-Launch Checklist

### Technical Requirements
- [ ] All APIs deployed and tested
- [ ] Database schema deployed to production
- [ ] Web frontend deployed and accessible
- [ ] iOS app builds and passes App Store validation
- [ ] Windows app builds and passes Store certification
- [ ] Cross-platform data synchronization working
- [ ] Image upload and storage functional
- [ ] User authentication system working
- [ ] Profile pages accessible (picmob.com/username)

### Legal and Compliance
- [ ] Privacy Policy published and accessible
- [ ] Terms of Service published and accessible  
- [ ] GDPR compliance measures implemented
- [ ] Age rating and content policies defined
- [ ] Copyright and DMCA procedures established
- [ ] Data retention policies documented

### App Store Requirements
- [ ] App metadata completed for all platforms
- [ ] Screenshots and app icons created
- [ ] App Store descriptions optimized
- [ ] Keywords researched and implemented
- [ ] In-app purchase setup (if applicable)
- [ ] Subscription management (if applicable)

### Marketing and Launch
- [ ] Landing page optimized for conversions
- [ ] Social media accounts created and configured
- [ ] Press kit and marketing materials prepared
- [ ] Analytics and tracking implemented
- [ ] Customer support system in place

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow platform-specific coding standards
- Write tests for new features
- Update documentation for API changes
- Ensure security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Deployment Guide](DEPLOYMENT_GUIDE_COMPLETE.md)  
- [Security Guide](docs/security.md)
- [Troubleshooting](docs/troubleshooting.md)

### Community
- **Issues**: [GitHub Issues](https://github.com/yourusername/picmob/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/picmob/discussions)
- **Email**: support@picmob.com

### Commercial Support
- **Enterprise**: enterprise@picmob.com
- **Partnerships**: partners@picmob.com

## 🏆 Acknowledgments

- **Cloudflare** - For providing excellent serverless infrastructure
- **Apple** - For SwiftUI and iOS/macOS development tools
- **Microsoft** - For .NET and Windows development platform
- **Open Source Community** - For the amazing libraries and tools

---

**Built with ❤️ for photographers and creators worldwide**

*Share your world with PicMob - where every photo tells a story.*