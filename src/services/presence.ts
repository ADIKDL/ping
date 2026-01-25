import { rtdb } from "@/backend/firebase";

export type PresenceState = {
  state: "online" | "offline";
  lastChanged: number | object;
};

export function startPresence(userId: string) {
  const presenceRef = rtdb.ref(`presence/${userId}`);
  const infoRef = rtdb.ref(".info/connected");
  const handler = infoRef.on("value", (snap) => {
    if (snap.val() === true) {
      presenceRef.onDisconnect().set({ state: "offline", lastChanged: Date.now() });
      presenceRef.set({ state: "online", lastChanged: Date.now() });
    }
  });
  return () => infoRef.off("value", handler);
}

export async function setUserOnline(userId: string) {
  const presenceRef = rtdb.ref(`presence/${userId}`);
  await presenceRef.onDisconnect().set({ state: "offline", lastChanged: Date.now() });
  await presenceRef.set({ state: "online", lastChanged: Date.now() });
}

export async function setUserOffline(userId: string) {
  const presenceRef = rtdb.ref(`presence/${userId}`);
  await presenceRef.set({ state: "offline", lastChanged: Date.now() });
}

export function listenToPresence(userId: string, callback: (state: PresenceState) => void) {
  const presenceRef = rtdb.ref(`presence/${userId}`);
  const handler = presenceRef.on("value", (snap) => {
    if (snap.exists()) {
      callback(snap.val() as PresenceState);
    }
  });
  return () => presenceRef.off("value", handler);
}
