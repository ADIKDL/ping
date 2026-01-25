import "dotenv/config";

const extra: Record<string, string | undefined> = {
  firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  firebaseDatabaseUrl: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL
};

if (process.env.EAS_PROJECT_ID) {
  (extra as any).eas = { projectId: process.env.EAS_PROJECT_ID };
}

export default {
  name: "Ping",
  slug: "ping-private-messenger",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.example.ping"
  },
  android: {
    package: "com.example.ping",
    adaptiveIcon: {
      backgroundColor: "#0f172a"
    },
    softwareKeyboardLayoutMode: "pan"
  },
  plugins: ["expo-notifications", "expo-image-picker", "expo-camera"],
  extra
};
