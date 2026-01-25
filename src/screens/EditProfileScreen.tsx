import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useAuthStore } from "@/store/useAuthStore";
import { uploadAvatar } from "@/services/storage";
import { updateProfile } from "@/services/users";

export function EditProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile } = useAuthStore();
  const [username, setUsername] = useState(profile?.username ?? "");
  const [status, setStatus] = useState(profile?.status ?? "");
  const [avatarUri, setAvatarUri] = useState<string | undefined>(profile?.avatarUrl);
  const [loading, setLoading] = useState(false);

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    let avatarUrl = profile.avatarUrl;
    if (avatarUri && avatarUri !== profile.avatarUrl) {
      avatarUrl = await uploadAvatar(profile.id, avatarUri);
    }
    await updateProfile(profile.id, {
      username: username.trim(),
      status,
      avatarUrl
    });
    setLoading(false);
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-sand-50 dark:bg-ink-900 px-6 pt-16">
      <Text className="text-3xl font-semibold text-ink-900 dark:text-white">Edit profile</Text>

      <TouchableOpacity onPress={handlePickAvatar} className="mt-8 self-start">
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} className="w-24 h-24 rounded-full" />
        ) : (
          <View className="w-24 h-24 rounded-full bg-ink-200 dark:bg-ink-700 items-center justify-center">
            <Text className="text-ink-700 dark:text-ink-100">Add</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        className="mt-8 rounded-2xl bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white"
      />
      <TextInput
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
        className="mt-4 rounded-2xl bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white"
      />
      <TouchableOpacity onPress={handleSave} className="mt-8 rounded-2xl bg-brand-500 py-4">
        <Text className="text-center text-white font-semibold">{loading ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </View>
  );
}
