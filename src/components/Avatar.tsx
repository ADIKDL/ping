import { Image, Text, View } from "react-native";

type AvatarProps = {
  uri?: string;
  size?: number;
  label?: string;
};

export function Avatar({ uri, size = 40, label }: AvatarProps) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  const initials = label
    ? label
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "?";

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="items-center justify-center bg-ink-200 dark:bg-ink-700"
    >
      <Text className="text-ink-700 dark:text-ink-100 font-semibold">{initials}</Text>
    </View>
  );
}
