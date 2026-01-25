import AsyncStorage from "@react-native-async-storage/async-storage";

export type QueuedMessage = {
  id: string;
  chatId: string;
  senderId: string;
  payload: { text?: string; imageUrl?: string; imageUri?: string; type: "text" | "image" };
  createdAt: number;
};

const QUEUE_KEY = "ping_offline_queue";

export async function getQueue(): Promise<QueuedMessage[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QueuedMessage[];
  } catch {
    return [];
  }
}

export async function enqueueMessage(msg: QueuedMessage) {
  const current = await getQueue();
  const next = [...current, msg];
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(next));
}

export async function dequeueMessage(id: string) {
  const current = await getQueue();
  const next = current.filter((item) => item.id !== id);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(next));
}

export async function clearQueue() {
  await AsyncStorage.removeItem(QUEUE_KEY);
}
