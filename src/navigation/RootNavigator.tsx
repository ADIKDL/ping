import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuthStore } from "@/store/useAuthStore";
import { SplashScreen } from "@/screens/SplashScreen";
import { LoginScreen } from "@/screens/LoginScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { MainTabs } from "@/navigation/MainTabs";
import { ChatScreen } from "@/screens/ChatScreen";
import { EditProfileScreen } from "@/screens/EditProfileScreen";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Onboarding: undefined;
  Main: undefined;
  Chat: { chatId: string; peerId: string };
  EditProfile: undefined;
};

const NativeStack = createNativeStackNavigator<RootStackParamList>();
const WebStack = createStackNavigator<RootStackParamList>();

function NativeRootStack() {
  const { user, profile, authLoading } = useAuthStore();

  return (
    <NativeStack.Navigator screenOptions={{ headerShown: false }}>
      {authLoading && <NativeStack.Screen name="Splash" component={SplashScreen} />}
      {!authLoading && !user && <NativeStack.Screen name="Login" component={LoginScreen} />}
      {!authLoading && user && !profile && (
        <NativeStack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
      {!authLoading && user && profile && (
        <>
          <NativeStack.Screen name="Main" component={MainTabs} />
          <NativeStack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <NativeStack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        </>
      )}
    </NativeStack.Navigator>
  );
}

function WebRootStack() {
  const { user, profile, authLoading } = useAuthStore();

  return (
    <WebStack.Navigator screenOptions={{ headerShown: false }}>
      {authLoading && <WebStack.Screen name="Splash" component={SplashScreen} />}
      {!authLoading && !user && <WebStack.Screen name="Login" component={LoginScreen} />}
      {!authLoading && user && !profile && (
        <WebStack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
      {!authLoading && user && profile && (
        <>
          <WebStack.Screen name="Main" component={MainTabs} />
          <WebStack.Screen name="Chat" component={ChatScreen} />
          <WebStack.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      )}
    </WebStack.Navigator>
  );
}

export function RootNavigator() {
  return Platform.OS === "web" ? <WebRootStack /> : <NativeRootStack />;
}
