import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Avatar } from "@/components/Avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { signOut } from "@/services/auth";
import { RootStackParamList } from "@/navigation/RootNavigator";

export function ProfileScreen() {
  const { profile } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 bg-sand-50 dark:bg-ink-900 px-6 pt-16">
      <Text className="text-3xl font-semibold text-ink-900 dark:text-white">Profile</Text>
      <View className="mt-8 items-center">
        <Avatar uri={profile?.avatarUrl} label={profile?.username} size={96} />
        <Text className="mt-4 text-xl font-semibold text-ink-900 dark:text-white">
          {profile?.username ?? ""}
        </Text>
        <Text className="mt-1 text-ink-500 dark:text-ink-300">{profile?.status}</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("EditProfile")}
        className="mt-10 rounded-2xl bg-brand-500 py-4"
      >
        <Text className="text-center text-white font-semibold">Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={signOut} className="mt-4 rounded-2xl bg-ink-200 dark:bg-ink-800 py-4">
        <Text className="text-center text-ink-700 dark:text-ink-200 font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
