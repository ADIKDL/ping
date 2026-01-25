import AsyncStorage from "@react-native-async-storage/async-storage";

export async function cacheChatMessages(chatId: string, data: unknown) {
  const key = `ping_chat_cache_${chatId}`;
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function getCachedChatMessages<T>(chatId: string): Promise<T | null> {
  const key = `ping_chat_cache_${chatId}`;
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
