# Ping — Private Messaging App

Ping is a portfolio-grade, cross-platform messaging app built with Expo + React Native and Firebase. It delivers a clean, modern chat experience with real-time updates, presence, typing indicators, offline queueing, and client-side encryption.

## Highlights
- Cross-platform: iOS + Android (Expo managed workflow)
- Firebase backend: Auth, Firestore (messages), RTDB (presence/typing), Storage (media)
- End-to-end client-side AES encryption (demo-friendly)
- Offline queueing + resend with local caching
- Modern UI with NativeWind and theme support
- Animated chat interactions + gesture navigation

## Tech Stack
- Expo SDK 54
- React Native + TypeScript
- NativeWind (Tailwind for RN)
- Firebase (Auth, Firestore, RTDB, Storage)
- Zustand for state management
- AsyncStorage for caching + offline queue

## Architecture
```
src/
  backend/        Firebase initialization
  services/       Auth, chat, storage, presence, notifications
  screens/        App screens (Login, Onboarding, Chat, etc.)
  components/     UI building blocks (ChatInput, MessageBubble, Avatar)
  hooks/          Presence + heartbeat hooks
  utils/          Encryption, cache, offline queue
  navigation/     Stack + tabs
  store/          Zustand state
```

## How to Run
1) `npm install`
2) Create `.env` from `.env.example`
3) `npm run start` and scan with Expo Go

## Notes
- Firebase config is public, but access is controlled by Firebase Rules.
- Expo Go does not support remote push notifications in SDK 53+.
- For production builds, use EAS.
