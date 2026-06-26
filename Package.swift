// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "PicMob",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(
            name: "PicMob",
            targets: ["PicMob"]
        ),
    ],
    dependencies: [
        // Core utilities
        .package(url: "https://github.com/apple/swift-algorithms", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-collections", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-log", from: "1.0.0"),
        
        // Numerical computing
        .package(url: "https://github.com/apple/swift-numerics", from: "1.0.0"),
        
        // Additional utilities (if needed)
        // .package(url: "https://github.com/CoreOffice/CoreXLSX", from: "0.14.0"),
        // .package(url: "https://github.com/tid-kijyun/Kanna", from: "5.2.0"),
    ],
    targets: [
        .executableTarget(
            name: "PicMob",
            path: "."
        )
    ]
)

