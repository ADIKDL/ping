import { View, Text } from "react-native";

type TypingIndicatorProps = {
  names: string[];
};

export function TypingIndicator({ names }: TypingIndicatorProps) {
  if (names.length === 0) return null;
  const label = names.length === 1 ? `${names[0]} is typing...` : "People are typing...";
  return (
    <View className="px-4 py-2">
      <Text className="text-xs text-ink-500 dark:text-ink-300">{label}</Text>
    </View>
  );
}
