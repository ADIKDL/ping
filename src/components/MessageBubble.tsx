import { Image, Text, View } from "react-native";
import { MessagePayload } from "@/types/models";

type MessageBubbleProps = {
  isMe: boolean;
  payload: MessagePayload;
  createdAt: number;
  status?: "sending" | "sent" | "read" | "failed";
};

export function MessageBubble({ isMe, payload, createdAt, status }: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <View className={`max-w-[82%] ${isMe ? "self-end" : "self-start"}`}>
      <View
        className={`rounded-2xl px-4 py-3 ${
          isMe
            ? "bg-brand-500 dark:bg-brand-600"
            : "bg-ink-100 dark:bg-ink-800"
        }`}
      >
        {payload.type === "image" && payload.imageUrl ? (
          <Image
            source={{ uri: payload.imageUrl }}
            className="w-56 h-48 rounded-xl mb-2"
            resizeMode="cover"
          />
        ) : null}
        {payload.text ? (
          <Text className={`${isMe ? "text-white" : "text-ink-900 dark:text-ink-50"}`}>
            {payload.text}
          </Text>
        ) : null}
        <View className="mt-2 flex-row items-center justify-end">
          <Text className={`${isMe ? "text-white/80" : "text-ink-500 dark:text-ink-300"} text-[11px]`}>
            {time}
          </Text>
          {isMe && status ? (
            <Text className="ml-2 text-white/80 text-[11px]">
              {status === "read" ? "Read" : status === "sending" ? "Sending" : status}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
