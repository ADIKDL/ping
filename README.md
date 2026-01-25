# Ping — Private Messaging App (Expo + React Native)

## Installation
- `npm install`
- `npm run start`
- Scan QR with Expo Go (iOS/Android)

## Firebase Setup (Free Tier)
1. Create a Firebase project.
2. Enable Authentication:
   - Email/Password
   - Phone (requires billing for some regions; use Email for demo if restricted)
3. Create Firestore (production or test mode).
4. Create Realtime Database.
5. Enable Storage.

## Firebase Config (Environment)
1. Copy `.env.example` to `.env`.
2. Fill in your Firebase values.
3. Restart Expo after edits.

Example `.env`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_DATABASE_URL=...
EAS_PROJECT_ID=...
```

## Firestore Collections
- `/users`
- `/profiles`
- `/chats/{chatId}/messages`

## RTDB Paths
- `/presence/{userId}`
- `/typing/{chatId}/{userId}`

## Storage Paths
- `/avatars`
- `/message-images`

## Push Notifications
- Expo push tokens are stored on the user profile.
- Use Expo's push API or Firebase Cloud Messaging server-side to deliver notifications.
- During development, test with the Expo push tool: https://expo.dev/notifications
 - Expo Go does not support remote notifications in SDK 53+; use EAS dev builds for full testing.

## Running with Expo Go
- `npm run start`
- Use a real device for phone auth and notifications.

## EAS Builds
1. `npx eas login`
2. APK (Android): `npx eas build -p android --profile preview`
3. AAB (Android): `npx eas build -p android --profile production`
4. iOS: `npx eas build -p ios --profile production`

## TestFlight
- Ensure iOS bundle identifier matches your Apple App ID.
- `npx eas build -p ios --profile production`
- `npx eas submit -p ios --latest`

## Notes
- AES encryption is performed client-side using a locally stored key.
- Offline messages are queued in AsyncStorage and resent on reconnect.
- Do not commit `.env` to public repos.
