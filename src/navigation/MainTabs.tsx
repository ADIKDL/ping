import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserListScreen } from "@/screens/UserListScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MainTabParamList = {
  Users: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabLabel({ label }: { label: string }) {
  return (
    <View className="items-center">
      <Text className="text-xs text-ink-600 dark:text-ink-200">{label}</Text>
    </View>
  );
}

export function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 6
        }
      }}
    >
      <Tab.Screen
        name="Users"
        component={UserListScreen}
        options={{
          tabBarLabel: () => <TabLabel label="Chats" />,
          tabBarIcon: () => <Text className="text-base">💬</Text>
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: () => <TabLabel label="Profile" />,
          tabBarIcon: () => <Text className="text-base">👤</Text>
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: () => <TabLabel label="Settings" />,
          tabBarIcon: () => <Text className="text-base">⚙️</Text>
        }}
      />
    </Tab.Navigator>
  );
}
