export type UserProfile = {
  id: string;
  email?: string;
  phone?: string;
  username: string;
  avatarUrl?: string;
  status?: string;
  expoPushToken?: string;
  createdAt: number;
};

export type MessagePayload = {
  text?: string;
  imageUrl?: string;
  type: "text" | "image";
};

export type EncryptedPayload = {
  ciphertext: string;
  iv: string;
  version: "v1";
};

export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: string;
  createdAt: number;
  readAt?: number;
  encrypted: EncryptedPayload;
  meta: {
    type: "text" | "image";
  };
};

export type ChatSummary = {
  chatId: string;
  peerId: string;
  lastMessage?: string;
  lastAt?: number;
};
