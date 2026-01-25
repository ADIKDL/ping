import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user, profile, authLoading } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authLoading && <Stack.Screen name="Splash" component={SplashScreen} />}
      {!authLoading && !user && <Stack.Screen name="Login" component={LoginScreen} />}
      {!authLoading && user && !profile && (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
      {!authLoading && user && profile && (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right"
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right"
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
