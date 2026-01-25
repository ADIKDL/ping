import { create } from "zustand";
import { auth, firestore } from "@/backend/firebase";
import { UserProfile } from "@/types/models";

type AuthState = {
  user: any | null;
  profile: UserProfile | null;
  authLoading: boolean;
  initAuth: () => void;
  setProfile: (profile: UserProfile | null) => void;
};

let unsubProfile: (() => void) | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  authLoading: true,
  initAuth: () => {
    auth.onAuthStateChanged((user) => {
      set({ user, authLoading: false });
      if (!user) {
        set({ profile: null });
        if (unsubProfile) {
          unsubProfile();
          unsubProfile = null;
        }
        return;
      }

      const ref = firestore.collection("users").doc(user.uid);
      if (unsubProfile) {
        unsubProfile();
      }
      unsubProfile = ref.onSnapshot((snap) => {
        if (snap.exists) {
          set({ profile: snap.data() as UserProfile });
        }
      });
    });
  },
  setProfile: (profile) => set({ profile })
}));
