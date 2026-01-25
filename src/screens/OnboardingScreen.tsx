import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth } from "@/backend/firebase";
import { uploadAvatar } from "@/services/storage";
import { createOrUpdateProfile } from "@/services/users";

export function OnboardingScreen() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("Hey there! I'm using Ping.");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleContinue = async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    try {
      let avatarUrl: string | undefined;
      if (avatarUri) {
        avatarUrl = await uploadAvatar(user.uid, avatarUri);
      }
      await createOrUpdateProfile({
        id: user.uid,
        email: user.email ?? undefined,
        phone: user.phoneNumber ?? undefined,
        username: username.trim(),
        avatarUrl,
        status,
        createdAt: Date.now()
      });
    } catch (err: any) {
      setError(err?.message ?? "Unable to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-sand-50 dark:bg-ink-900 px-6 pt-16">
      <Text className="text-3xl font-semibold text-ink-900 dark:text-white">Set up your profile</Text>
      <Text className="mt-2 text-ink-600 dark:text-ink-300">Add a photo and username.</Text>

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
      <TouchableOpacity
        onPress={handleContinue}
        disabled={loading}
        className="mt-8 rounded-2xl bg-brand-500 py-4"
      >
        <Text className="text-center text-white font-semibold">{loading ? "Saving..." : "Continue"}</Text>
      </TouchableOpacity>
      {error ? <Text className="mt-3 text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}
