import SwiftUI

struct ImageViewerToolbar: View {
    let onRotateLeft: () -> Void
    let onRotateRight: () -> Void

    var body: some View {
        HStack {
            Button(action: onRotateLeft) {
                Label("Rotate Left", systemImage: "rotate.left")
            }
            Button(action: onRotateRight) {
                Label("Rotate Right", systemImage: "rotate.right")
            }
        }
        .padding()
    }
}