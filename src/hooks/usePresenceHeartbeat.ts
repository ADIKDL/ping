import { useEffect } from "react";
import { AppState } from "react-native";
import { setUserOffline, startPresence } from "@/services/presence";
type UserLike = { uid: string };

export function usePresenceHeartbeat(user: UserLike | null) {
  useEffect(() => {
    if (!user) return;
    const stop = startPresence(user.uid);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        startPresence(user.uid);
      } else {
        setUserOffline(user.uid);
      }
    });
    return () => {
      stop();
      sub.remove();
      setUserOffline(user.uid);
    };
  }, [user]);
}
