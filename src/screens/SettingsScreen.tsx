import { Text, TouchableOpacity, View } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

export function SettingsScreen() {
  const { themePreference, setThemePreference } = useThemeStore();

  return (
    <View className="flex-1 bg-sand-50 dark:bg-ink-900 px-6 pt-16">
      <Text className="text-3xl font-semibold text-ink-900 dark:text-white">Settings</Text>

      <View className="mt-8">
        <Text className="text-sm text-ink-500 dark:text-ink-300">Theme</Text>
        <View className="mt-4 flex-row">
          {(["light", "dark", "system"] as const).map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => setThemePreference(value)}
              className={`mr-3 rounded-2xl px-4 py-2 ${
                themePreference === value ? "bg-brand-500" : "bg-ink-200 dark:bg-ink-800"
              }`}
            >
              <Text className={`${themePreference === value ? "text-white" : "text-ink-700 dark:text-ink-200"}`}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mt-10 rounded-2xl bg-white dark:bg-ink-800 p-4">
        <Text className="text-ink-900 dark:text-white font-semibold">Notifications</Text>
        <Text className="mt-2 text-xs text-ink-500 dark:text-ink-300">
          Expo push tokens are stored in your profile for server-side delivery.
        </Text>
      </View>
    </View>
  );
}
