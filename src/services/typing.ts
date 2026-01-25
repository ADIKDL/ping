import { rtdb } from "@/backend/firebase";

export function setTyping(chatId: string, userId: string, typing: boolean) {
  const typingRef = rtdb.ref(`typing/${chatId}/${userId}`);
  return typingRef.set({ typing, updatedAt: Date.now() });
}

export function listenToTyping(chatId: string, callback: (typingUserIds: string[]) => void) {
  const typingRef = rtdb.ref(`typing/${chatId}`);
  const handler = typingRef.on("value", (snap) => {
    if (!snap.exists()) {
      callback([]);
      return;
    }
    const data = snap.val() as Record<string, { typing: boolean }>;
    const active = Object.entries(data)
      .filter(([, value]) => value?.typing)
      .map(([userId]) => userId);
    callback(active);
  });
  return () => typingRef.off("value", handler);
}
