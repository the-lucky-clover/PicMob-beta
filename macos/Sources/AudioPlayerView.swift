import SwiftUI
import AVKit

struct AudioPlayerView: View {
    let url: URL
    @State private var player = AVPlayer()

    var body: some View {
        VStack {
            Text(url.lastPathComponent)
            VideoPlayer(player: player)
                .frame(height: 60)
                .onAppear {
                    player.replaceCurrentItem(with: AVPlayerItem(url: url))
                }
        }
    }
}