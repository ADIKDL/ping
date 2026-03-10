import { auth } from "@/backend/firebase";

export async function signInWithEmail(email: string, password: string) {
  return auth.signInWithEmailAndPassword(email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  return auth.createUserWithEmailAndPassword(email, password);
}

export async function signOut() {
  return auth.signOut();
}
