import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function SplashScreen() {
  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#1d4ff2"]}
      className="flex-1 items-center justify-center"
    >
      <Text className="text-4xl text-white font-semibold">Ping</Text>
      <Text className="mt-2 text-white/80">Private messages for your crew</Text>
    </LinearGradient>
  );
}
