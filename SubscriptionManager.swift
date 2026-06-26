import Foundation

class SubscriptionManager: ObservableObject {
    @Published var isSubscribed: Bool = false
    @Published var subscriptionStatus: String = "Free"

    func checkSubscriptionStatus() {
        // Replace with real subscription check logic
        isSubscribed = UserDefaults.standard.bool(forKey: "PicMobIsSubscribed")
        subscriptionStatus = isSubscribed ? "Pro" : "Free"
    }

    func subscribe() {
        // Replace with real purchase logic
        UserDefaults.standard.set(true, forKey: "PicMobIsSubscribed")
        checkSubscriptionStatus()
    }

    func cancelSubscription() {
        // Replace with real cancellation logic
        UserDefaults.standard.set(false, forKey: "PicMobIsSubscribed")
        checkSubscriptionStatus()
    }
}