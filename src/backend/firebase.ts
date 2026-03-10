import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";
import Constants from "expo-constants";

type ExpoExtra = {
  firebaseApiKey?: string;
  firebaseAuthDomain?: string;
  firebaseProjectId?: string;
  firebaseStorageBucket?: string;
  firebaseMessagingSenderId?: string;
  firebaseAppId?: string;
  firebaseDatabaseUrl?: string;
};

type ExpoConstantsWithManifest = typeof Constants & {
  manifest?: { extra?: ExpoExtra };
  manifest2?: { extra?: ExpoExtra };
};

const constants = Constants as ExpoConstantsWithManifest;
const extra =
  (Constants.expoConfig?.extra ??
    constants.manifest2?.extra ??
    constants.manifest?.extra ??
    {}) as ExpoExtra;

const firebaseDatabaseUrl = extra.firebaseDatabaseUrl?.trim();

if (!firebaseDatabaseUrl || !firebaseDatabaseUrl.startsWith("https://")) {
  throw new Error(
    "Missing Firebase Realtime Database URL. Set EXPO_PUBLIC_FIREBASE_DATABASE_URL for the EAS build."
  );
}

export const firebaseConfig = {
  apiKey: extra.firebaseApiKey ?? "YOUR_FIREBASE_API_KEY",
  authDomain: extra.firebaseAuthDomain ?? "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: extra.firebaseProjectId ?? "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: extra.firebaseStorageBucket ?? "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: extra.firebaseMessagingSenderId ?? "YOUR_MESSAGING_SENDER_ID",
  appId: extra.firebaseAppId ?? "YOUR_FIREBASE_APP_ID",
  databaseURL: firebaseDatabaseUrl
};

const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const rtdb = firebase.database();
export const storage = firebase.storage();
