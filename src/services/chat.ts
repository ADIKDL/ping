import { firestore } from "@/backend/firebase";
import { encryptPayload } from "@/utils/crypto";
import { ChatMessage, MessagePayload } from "@/types/models";

export function getChatId(a: string, b: string) {
  return [a, b].sort().join("_");
}

export async function ensureChat(chatId: string, members: string[]) {
  const ref = firestore.collection("chats").doc(chatId);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      id: chatId,
      members,
      createdAt: Date.now()
    });
  }
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  payload: MessagePayload
) {
  const encrypted = await encryptPayload(payload, chatId);
  const ref = firestore.collection(`chats/${chatId}/messages`);
  const docRef = await ref.add({
    chatId,
    senderId,
    createdAt: Date.now(),
    encrypted,
    meta: { type: payload.type }
  });
  await firestore.collection("chats").doc(chatId).set(
    {
      lastMessage: payload.type === "text" ? payload.text ?? "" : "Image",
      lastAt: Date.now()
    },
    { merge: true }
  );
  return docRef.id;
}

export function listenMessages(
  chatId: string,
  callback: (messages: ChatMessage[]) => void
) {
  const q = firestore
    .collection(`chats/${chatId}/messages`)
    .orderBy("createdAt", "desc")
    .limit(50);
  return q.onSnapshot((snap) => {
    const messages = snap.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<ChatMessage, "id">)
    }));
    callback(messages);
  });
}

export async function markMessageRead(chatId: string, messageId: string) {
  const msgRef = firestore.collection(`chats/${chatId}/messages`).doc(messageId);
  await msgRef.set({ readAt: Date.now() }, { merge: true });
}
