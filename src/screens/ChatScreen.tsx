import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import NetInfo from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { Avatar } from "@/components/Avatar";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { MessageBubble } from "@/components/MessageBubble";
import { useAuthStore } from "@/store/useAuthStore";
import { getProfile } from "@/services/users";
import { listenMessages, markMessageRead, sendMessage } from "@/services/chat";
import { listenToTyping, setTyping } from "@/services/typing";
import { decryptPayload } from "@/utils/crypto";
import { uploadMessageImage } from "@/services/storage";
import { enqueueMessage, getQueue, dequeueMessage, QueuedMessage } from "@/utils/offlineQueue";
import { MessagePayload } from "@/types/models";
import { usePresence } from "@/hooks/usePresence";
import { cacheChatMessages, getCachedChatMessages } from "@/utils/cache";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ScreenRoute = RouteProp<RootStackParamList, "Chat">;

type LocalMessage = {
  id: string;
  payload: MessagePayload;
  senderId: string;
  createdAt: number;
  status?: "sending" | "sent" | "read" | "failed";
  readAt?: number;
};

export function ChatScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScreenRoute>();
  const { chatId, peerId } = route.params;
  const { profile } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [peer, setPeer] = useState<{ username: string; avatarUrl?: string } | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [pending, setPending] = useState<LocalMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);
  const presence = usePresence(peerId);

  const mediaEnabled = false;

  useEffect(() => {
    getProfile(peerId).then((data) => {
      if (data) setPeer({ username: data.username, avatarUrl: data.avatarUrl });
    });
  }, [peerId]);

  useEffect(() => {
    getCachedChatMessages<LocalMessage[]>(chatId).then((cached) => {
      if (cached) setMessages(cached);
    });
    const unsub = listenMessages(chatId, async (snapshot) => {
      const decrypted = await Promise.all(
        snapshot.map(async (msg) => {
          try {
            const payload = await decryptPayload(msg.encrypted, chatId);
            return {
              id: msg.id,
              payload: payload as MessagePayload,
              senderId: msg.senderId,
              createdAt: msg.createdAt,
              readAt: msg.readAt,
              status: msg.readAt ? "read" : "sent"
            } as LocalMessage;
          } catch {
            return {
              id: msg.id,
              payload: { type: "text", text: "Unable to decrypt message" },
              senderId: msg.senderId,
              createdAt: msg.createdAt,
              readAt: msg.readAt,
              status: msg.readAt ? "read" : "sent"
            } as LocalMessage;
          }
        })
      );
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages(decrypted);
      cacheChatMessages(chatId, decrypted);
    });
    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    const unsub = listenToTyping(chatId, (ids) => {
      const filtered = profile ? ids.filter((id) => id !== profile.id) : ids;
      setTypingUsers(filtered);
    });
    return () => unsub();
  }, [chatId, profile]);

  useEffect(() => {
    const sub = NetInfo.addEventListener(async (state) => {
      if (!state.isConnected || !profile) return;
      const queue = await getQueue();
      for (const item of queue) {
        const ok = await sendQueued(item);
        if (ok) {
          await dequeueMessage(item.id);
          setPending((prev) => prev.filter((msg) => msg.id !== item.id));
        }
      }
    });
    return () => sub();
  }, [profile]);

  const handleSend = async (text: string) => {
    if (!profile) return;
    const tempId = `local_${Date.now()}`;
    const payload: MessagePayload = { text, type: "text" };
    const localMsg: LocalMessage = {
      id: tempId,
      payload,
      senderId: profile.id,
      createdAt: Date.now(),
      status: "sending"
    };
    setPending((prev) => [localMsg, ...prev]);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      await enqueueMessage({
        id: tempId,
        chatId,
        senderId: profile.id,
        payload,
        createdAt: Date.now()
      });
      return;
    }
    try {
      setSendError(null);
      await sendMessage(chatId, profile.id, payload);
      setPending((prev) => prev.filter((msg) => msg.id !== tempId));
    } catch (err: any) {
      console.warn("Send message failed", err);
      setSendError(err?.message ?? "Message failed to send.");
      setPending((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, status: "failed" } : msg)));
    }
  };

  const handlePickImage = async () => {
    if (!mediaEnabled) return;
    if (!profile) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });
    if (result.canceled) return;
    const localUri = result.assets[0].uri;
    const tempId = `local_${Date.now()}`;
    const localMsg: LocalMessage = {
      id: tempId,
      payload: { type: "image", imageUrl: localUri },
      senderId: profile.id,
      createdAt: Date.now(),
      status: "sending"
    };
    setPending((prev) => [localMsg, ...prev]);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      await enqueueMessage({
        id: tempId,
        chatId,
        senderId: profile.id,
        payload: { type: "image", imageUri: localUri },
        createdAt: Date.now()
      });
      return;
    }
    try {
      setSendError(null);
      const imageUrl = await uploadMessageImage(chatId, localUri, tempId);
      await sendMessage(chatId, profile.id, { type: "image", imageUrl });
      setPending((prev) => prev.filter((msg) => msg.id !== tempId));
    } catch (err: any) {
      console.warn("Send image failed", err);
      setSendError(err?.message ?? "Image failed to send.");
      setPending((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, status: "failed" } : msg)));
    }
  };

  const handlePickCamera = async () => {
    if (!mediaEnabled) return;
    if (!profile) return;
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: false
    });
    if (result.canceled) return;
    const localUri = result.assets[0].uri;
    const tempId = `local_${Date.now()}`;
    const localMsg: LocalMessage = {
      id: tempId,
      payload: { type: "image", imageUrl: localUri },
      senderId: profile.id,
      createdAt: Date.now(),
      status: "sending"
    };
    setPending((prev) => [localMsg, ...prev]);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      await enqueueMessage({
        id: tempId,
        chatId,
        senderId: profile.id,
        payload: { type: "image", imageUri: localUri },
        createdAt: Date.now()
      });
      return;
    }
    try {
      setSendError(null);
      const imageUrl = await uploadMessageImage(chatId, localUri, tempId);
      await sendMessage(chatId, profile.id, { type: "image", imageUrl });
      setPending((prev) => prev.filter((msg) => msg.id !== tempId));
    } catch (err: any) {
      console.warn("Send camera image failed", err);
      setSendError(err?.message ?? "Image failed to send.");
      setPending((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, status: "failed" } : msg)));
    }
  };

  const sendQueued = async (item: QueuedMessage) => {
    if (!item.payload) return;
    try {
      if (item.payload.type === "image" && item.payload.imageUri) {
        const imageUrl = await uploadMessageImage(item.chatId, item.payload.imageUri, item.id);
        await sendMessage(item.chatId, item.senderId, { type: "image", imageUrl });
      } else {
        await sendMessage(item.chatId, item.senderId, {
          type: "text",
          text: item.payload.text
        });
      }
      return true;
    } catch (err) {
      console.warn("Queued message failed", err);
      return false;
    }
  };

  const combined = useMemo(() => [...pending, ...messages], [pending, messages]);
  const filtered = useMemo(() => {
    if (!searchOpen || !searchQuery.trim()) return combined;
    const q = searchQuery.trim().toLowerCase();
    return combined.filter((msg) => msg.payload.text?.toLowerCase().includes(q));
  }, [combined, searchOpen, searchQuery]);

  useEffect(() => {
    if (!profile) return;
    combined.forEach((msg) => {
      if (msg.id.startsWith("local_")) return;
      if (msg.senderId !== profile.id && !msg.readAt) {
        markMessageRead(chatId, msg.id);
      }
    });
  }, [combined, profile, chatId]);

  const handleTyping = (typing: boolean) => {
    if (!profile) return;
    setTyping(chatId, profile.id, typing);
  };

  useEffect(() => {
    return () => {
      if (profile) setTyping(chatId, profile.id, false);
    };
  }, [chatId, profile]);

  const online = presence?.state === "online";
  const lastSeen = presence?.lastChanged
    ? new Date(presence.lastChanged as number).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <View className="flex-1 bg-sand-50 dark:bg-ink-900">
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center px-4 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Text className="text-brand-500 text-lg">&lt;</Text>
        </TouchableOpacity>
        <Avatar uri={peer?.avatarUrl} label={peer?.username} size={38} />
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-ink-900 dark:text-white">
            {peer?.username ?? "Chat"}
          </Text>
          <Text className="text-xs text-ink-500 dark:text-ink-300">
            {online ? "Online" : lastSeen ? `Last seen ${lastSeen}` : "Offline"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setMenuOpen(true)} className="px-2 py-1">
          <Text className="text-ink-600 dark:text-ink-200 text-lg">...</Text>
        </TouchableOpacity>
      </View>

      {searchOpen ? (
        <View className="px-4 pb-2">
          <View className="flex-row items-center rounded-2xl bg-white dark:bg-ink-800 px-4 py-2">
            <TextInput
              placeholder="Search in chat"
              placeholderTextColor="#7e94ae"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-base text-ink-900 dark:text-ink-100"
            />
            <TouchableOpacity onPress={() => setSearchQuery("")}> 
              <Text className="text-xs text-ink-500">Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 56 : 0}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={listRef}
          data={filtered}
          keyExtractor={(item) => item.id}
          inverted
          onContentSizeChange={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 + insets.bottom }}
          renderItem={({ item }) => (
            <View className="py-2">
              <MessageBubble
                isMe={item.senderId === profile?.id}
                payload={item.payload}
                createdAt={item.createdAt}
                status={item.status}
              />
            </View>
          )}
        />
        <TypingIndicator names={typingUsers.map((id) => (id === peerId ? peer?.username ?? "Someone" : "Someone"))} />
        {sendError ? (
          <View className="px-4 pb-2">
            <Text className="text-xs text-red-500">{sendError}</Text>
          </View>
        ) : null}
        <ChatInput
          onSend={handleSend}
          onTyping={handleTyping}
          bottomInset={insets.bottom}
          showMedia={mediaEnabled}
          onPickImage={mediaEnabled ? handlePickImage : undefined}
          onPickCamera={mediaEnabled ? handlePickCamera : undefined}
        />
      </KeyboardAvoidingView>

      <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <TouchableOpacity
          onPress={() => setMenuOpen(false)}
          className="flex-1 bg-black/40 justify-start"
        >
          <View className="mt-16 mx-4 rounded-2xl bg-white dark:bg-ink-800 p-4">
            <TouchableOpacity
              onPress={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="py-2"
            >
              <Text className="text-ink-900 dark:text-ink-100">Search chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuOpen(false);
                setProfileOpen(true);
              }}
              className="py-2"
            >
              <Text className="text-ink-900 dark:text-ink-100">View profile</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal transparent visible={profileOpen} animationType="fade" onRequestClose={() => setProfileOpen(false)}>
        <TouchableOpacity onPress={() => setProfileOpen(false)} className="flex-1 bg-black/40 justify-center">
          <View className="mx-6 rounded-2xl bg-white dark:bg-ink-800 p-6">
            <View className="items-center">
              <Avatar uri={peer?.avatarUrl} label={peer?.username} size={72} />
              <Text className="mt-4 text-lg font-semibold text-ink-900 dark:text-white">
                {peer?.username ?? "User"}
              </Text>
              <Text className="mt-1 text-xs text-ink-500 dark:text-ink-300">
                {online ? "Online" : lastSeen ? `Last seen ${lastSeen}` : "Offline"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
