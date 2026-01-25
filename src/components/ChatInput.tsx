import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type ChatInputProps = {
  onSend: (text: string) => void;
  onPickImage?: () => void;
  onPickCamera?: () => void;
  onTyping: (typing: boolean) => void;
  bottomInset?: number;
  showMedia?: boolean;
};

export function ChatInput({
  onSend,
  onPickImage,
  onPickCamera,
  onTyping,
  bottomInset = 0,
  showMedia = true
}: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    onTyping(false);
  };

  return (
    <View
      style={{ paddingBottom: 12 + bottomInset }}
      className="flex-row items-end px-4 pt-3 bg-white dark:bg-ink-900 border-t border-ink-100 dark:border-ink-800"
    >
      {showMedia ? (
        <>
          <TouchableOpacity onPress={onPickCamera} className="mr-2 mb-1">
            <Text className="text-xl">📸</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPickImage} className="mr-3 mb-1">
            <Text className="text-xl">🖼️</Text>
          </TouchableOpacity>
        </>
      ) : null}
      <View className="flex-1 rounded-2xl bg-ink-100 dark:bg-ink-800 px-4 py-3">
        <TextInput
          placeholder="Message"
          placeholderTextColor="#7e94ae"
          value={text}
          onChangeText={(value) => {
            setText(value);
            onTyping(value.length > 0);
          }}
          className="text-base text-ink-900 dark:text-ink-100"
          multiline
        />
      </View>
      <TouchableOpacity onPress={handleSend} className="ml-3 mb-1">
        <Text className="text-brand-500 font-semibold">Send</Text>
      </TouchableOpacity>
    </View>
  );
}
