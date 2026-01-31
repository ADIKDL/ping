import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserListScreen } from "@/screens/UserListScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { Platform, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MainTabParamList = {
  Users: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      className={`text-[11px] ${focused ? "text-ink-900 dark:text-white" : "text-ink-500 dark:text-ink-300"}`}
      style={{ letterSpacing: 0.4 }}
    >
      {label}
    </Text>
  );
}

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View
      className={`h-8 w-8 items-center justify-center rounded-full ${
        focused ? "bg-ink-200 dark:bg-ink-800" : "bg-transparent"
      }`}
    >
      <Text className={`text-base ${focused ? "text-ink-900 dark:text-white" : "text-ink-500 dark:text-ink-300"}`}>
        {icon}
      </Text>
    </View>
  );
}

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: isWeb ? 56 : 64 + insets.bottom,
          paddingBottom: isWeb ? 8 : 10 + insets.bottom,
          paddingTop: 6,
          borderTopWidth: 1,
          borderTopColor: "rgba(148, 163, 184, 0.2)"
        },
        tabBarItemStyle: {
          paddingTop: 4,
          alignItems: "center",
          justifyContent: "center"
        },
        tabBarLabelPosition: "below-icon"
      }}
    >
      <Tab.Screen
        name="Users"
        component={UserListScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Chats" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon icon="💬" focused={focused} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Settings" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />
        }}
      />
    </Tab.Navigator>
  );
}
