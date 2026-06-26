//
//  PicMobTheme.swift
//  PicMob
//
//  Created by PicMob Team.
//

import SwiftUI

struct PicMobTheme {
    // Mafia Edge Color Palette
    static let goldAccent = Color(red: 1.0, green: 0.843, blue: 0.0) // #FFD700
    static let darkGray = Color(red: 0.173, green: 0.173, blue: 0.173) // #2C2C2C
    static let deepBlack = Color(red: 0.102, green: 0.102, blue: 0.102) // #1A1A1A
    static let antiqueBrass = Color(red: 0.722, green: 0.525, blue: 0.043) // #B8860B
    static let charcoal = Color(red: 0.212, green: 0.212, blue: 0.212) // #363636
    
    // Background Colors
    static let primaryBackground = deepBlack
    static let sidebarBackground = darkGray
    static let viewerBackground = Color.black
    static let toolbarBackground = charcoal
    static let statusBarBackground = darkGray
    
    // Text Colors
    static let primaryText = Color.white
    static let secondaryText = Color.gray
    static let accentText = goldAccent
    static let mutedText = Color(white: 0.6)
    
    // Border Colors
    static let borderColor = Color(white: 0.3)
    static let focusBorder = goldAccent
    
    // Typography
    static let titleFont = Font.custom("Times New Roman", size: 24).weight(.bold)
    static let headlineFont = Font.custom("Times New Roman", size: 18).weight(.semibold)
    static let bodyFont = Font.system(size: 14, weight: .regular, design: .default)
    static let captionFont = Font.system(size: 12, weight: .regular, design: .default)
}

// Custom button style for mafia edge aesthetic
struct PicMobButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 6)
                    .fill(configuration.isPressed ? PicMobTheme.antiqueBrass : PicMobTheme.goldAccent)
            )
            .foregroundColor(PicMobTheme.deepBlack)
            .font(PicMobTheme.bodyFont.weight(.semibold))
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// Custom toolbar style
struct PicMobToolbarStyle: ToolbarStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.content
            .background(PicMobTheme.toolbarBackground)
            .border(PicMobTheme.borderColor, width: 0.5)
    }
}

// Custom sidebar style
struct PicMobSidebarStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .background(PicMobTheme.sidebarBackground)
            .foregroundColor(PicMobTheme.primaryText)
    }
}

extension View {
    func picMobSidebarStyle() -> some View {
        modifier(PicMobSidebarStyle())
    }
}

