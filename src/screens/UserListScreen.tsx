import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { listUsers } from "@/services/users";
import { useAuthStore } from "@/store/useAuthStore";
import { UserProfile } from "@/types/models";
import { Avatar } from "@/components/Avatar";
import { usePresence } from "@/hooks/usePresence";
import { getChatId, ensureChat } from "@/services/chat";
import { RootStackParamList } from "@/navigation/RootNavigator";

export function UserListScreen() {
  const { profile } = useAuthStore();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [query, setQuery] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const loadUsers = useCallback(async () => {
    if (!profile) return;
    const data = await listUsers(profile.id);
    setUsers(data);
  }, [profile]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.trim().toLowerCase();
    return users.filter((user) => user.username.toLowerCase().includes(q));
  }, [users, query]);

  const handleStartChat = async (peer: UserProfile) => {
    if (!profile) return;
    const chatId = getChatId(profile.id, peer.id);
    await ensureChat(chatId, [profile.id, peer.id]);
    navigation.navigate("Chat", { chatId, peerId: peer.id });
  };

  return (
    <View className="flex-1 bg-sand-50 dark:bg-ink-900">
      <View className="px-6 pb-4" style={{ paddingTop: Platform.OS === "web" ? 32 : 64 }}>
        <View className="w-full" style={{ maxWidth: 880, alignSelf: "center" }}>
          <Text className="text-3xl font-semibold text-ink-900 dark:text-white">Your people</Text>
          <Text className="mt-2 text-ink-600 dark:text-ink-300">
            Start a private chat.
          </Text>
          <TextInput
            placeholder="Search username"
            placeholderTextColor="#7e94ae"
            value={query}
            onChangeText={setQuery}
            className="mt-5 rounded-2xl bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white"
          />
          <TouchableOpacity
            onPress={loadUsers}
            className="mt-4 self-start rounded-full bg-ink-200 dark:bg-ink-800 px-4 py-2"
          >
            <Text className="text-ink-700 dark:text-ink-200 text-xs">Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View className="px-6 pt-10" style={{ maxWidth: 880, alignSelf: "center" }}>
            <Text className="text-base text-ink-500 dark:text-ink-300">
              No users found yet.
            </Text>
            <Text className="mt-2 text-xs text-ink-400 dark:text-ink-400">
              Create another account on a second device or sign up with a different email to start chatting.
            </Text>
          </View>
        )}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: Platform.OS === "web" ? 32 : 140,
          maxWidth: 880,
          alignSelf: "center",
          width: "100%"
        }}
        renderItem={({ item }) => <UserRow user={item} onPress={() => handleStartChat(item)} />}
      />
    </View>
  );
}

function UserRow({ user, onPress }: { user: UserProfile; onPress: () => void }) {
  const presence = usePresence(user.id);
  const online = presence?.state === "online";
  const lastSeen = presence?.lastChanged
    ? new Date(presence.lastChanged as number).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-4 border-b border-ink-100 dark:border-ink-800">
      <Avatar uri={user.avatarUrl} label={user.username} />
      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-ink-900 dark:text-white">{user.username}</Text>
        <Text className="text-xs text-ink-500 dark:text-ink-300">
          {online ? "Online" : lastSeen ? `Last seen ${lastSeen}` : "Offline"}
        </Text>
      </View>
      <View className={`h-2.5 w-2.5 rounded-full ${online ? "bg-green-400" : "bg-ink-300"}`} />
    </TouchableOpacity>
  );
}
