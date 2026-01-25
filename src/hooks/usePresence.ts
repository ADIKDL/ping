import { useEffect, useState } from "react";
import { listenToPresence, PresenceState } from "@/services/presence";

export function usePresence(userId?: string) {
  const [presence, setPresence] = useState<PresenceState | null>(null);

  useEffect(() => {
    if (!userId) return;
    const unsub = listenToPresence(userId, (state) => setPresence(state));
    return () => unsub();
  }, [userId]);

  return presence;
}
