import SwiftUI

struct SubscriptionView: View {
    @ObservedObject var manager: SubscriptionManager

    var body: some View {
        VStack(spacing: 24) {
            Text("PicMob Subscription")
                .font(.largeTitle)
                .bold()
                .padding(.top)
            Text(manager.isSubscribed ? "You are a Pro subscriber!" : "Upgrade to Pro for more features.")
                .font(.title2)
                .foregroundColor(.secondary)
            HStack(spacing: 32) {
                VStack {
                    Text("Free")
                        .font(.headline)
                    Text("Basic viewing\nLimited editing")
                        .multilineTextAlignment(.center)
                        .foregroundColor(.gray)
                }
                VStack {
                    Text("Pro")
                        .font(.headline)
                    Text("Advanced editing\nAI features\nBatch processing\nPriority support")
                        .multilineTextAlignment(.center)
                        .foregroundColor(.blue)
                }
            }
            if manager.isSubscribed {
                Button("Cancel Subscription") {
                    manager.cancelSubscription()
                }
                .foregroundColor(.red)
            } else {
                Button("Upgrade to Pro") {
                    manager.subscribe()
                }
                .buttonStyle(.borderedProminent)
            }
            Spacer()
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.systemGray6))
                .shadow(radius: 8)
        )
        .padding()
    }
}