import "react-native-gesture-handler";
import "./global.css";
import { useEffect } from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { useThemeStore } from "./src/store/useThemeStore";
import { useAuthStore } from "./src/store/useAuthStore";
import { initNotifications } from "./src/services/notifications";
import { usePresenceHeartbeat } from "./src/hooks/usePresenceHeartbeat";

export default function App() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { themePreference, hydrateTheme } = useThemeStore();
  const { initAuth, user } = useAuthStore();

  useEffect(() => {
    hydrateTheme();
    initAuth();
    initNotifications();
  }, [hydrateTheme, initAuth]);

  usePresenceHeartbeat(user);

  useEffect(() => {
    if (themePreference === "system") {
      setColorScheme("system");
      return;
    }
    setColorScheme(themePreference);
  }, [themePreference, setColorScheme]);

  const navTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
