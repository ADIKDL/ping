import { firestore } from "@/backend/firebase";
import { UserProfile } from "@/types/models";

export async function createOrUpdateProfile(profile: UserProfile) {
  const cleanProfile = Object.fromEntries(
    Object.entries(profile).filter(([, value]) => value !== undefined)
  ) as UserProfile;
  const userRef = firestore.collection("users").doc(profile.id);
  const profileRef = firestore.collection("profiles").doc(profile.id);
  await Promise.all([userRef.set(cleanProfile), profileRef.set(cleanProfile)]);
}

export async function updateProfile(userId: string, data: Partial<UserProfile>) {
  const userRef = firestore.collection("users").doc(userId);
  const profileRef = firestore.collection("profiles").doc(userId);
  await Promise.all([userRef.set(data, { merge: true }), profileRef.set(data, { merge: true })]);
}

export async function getProfile(userId: string) {
  const ref = firestore.collection("users").doc(userId);
  const snap = await ref.get();
  return snap.exists ? (snap.data() as UserProfile) : null;
}

export async function listUsers(excludeId?: string) {
  const ref = firestore.collection("users");
  const snap = await ref.get();
  const users = snap.docs.map((docItem) => docItem.data() as UserProfile);
  return excludeId ? users.filter((user) => user.id !== excludeId) : users;
}
