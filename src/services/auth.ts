import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { auth } from "@/backend/firebase";

export async function signInWithEmail(email: string, password: string) {
  return auth.signInWithEmailAndPassword(email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  return auth.createUserWithEmailAndPassword(email, password);
}

export async function signInWithPhone(
  phone: string,
  recaptchaVerifier: FirebaseRecaptchaVerifierModal
) {
  return auth.signInWithPhoneNumber(phone, recaptchaVerifier as any);
}

export async function confirmPhoneCode(
  verificationId: string,
  code: string
) {
  const credential = (auth as any).PhoneAuthProvider.credential(verificationId, code);
  return auth.signInWithCredential(credential);
}

export async function signOut() {
  return auth.signOut();
}
