import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";

type ThemeState = {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  hydrateTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themePreference: "system",
      setThemePreference: (pref) => set({ themePreference: pref }),
      hydrateTheme: () => set((state) => state)
    }),
    {
      name: "ping-theme",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
