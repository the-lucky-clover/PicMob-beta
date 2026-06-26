import SwiftUI
import AVKit

struct VideoViewerView: View {
    let url: URL

    var body: some View {
        VideoPlayer(player: AVPlayer(url: url))
            .aspectRatio(16/9, contentMode: .fit)
    }
}