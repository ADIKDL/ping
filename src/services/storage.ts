import { storage } from "@/backend/firebase";

export async function uploadAvatar(userId: string, uri: string) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const fileRef = storage.ref(`avatars/${userId}`);
  await fileRef.put(blob);
  return fileRef.getDownloadURL();
}

export async function uploadMessageImage(chatId: string, uri: string, messageId: string) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const fileRef = storage.ref(`message-images/${chatId}/${messageId}`);
  await fileRef.put(blob);
  return fileRef.getDownloadURL();
}
