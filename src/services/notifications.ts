import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { auth } from "@/backend/firebase";
import { updateProfile } from "@/services/users";

export async function initNotifications() {
  if (!Device.isDevice) return;
  if (Constants.appOwnership === "expo") return;
  const Notifications = await import("expo-notifications");
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true
    })
  });
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return;

  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    if (Platform.OS !== "web") {
      try {
        await Notifications.getDevicePushTokenAsync();
      } catch {
        // Device push token is available in standalone builds
      }
    }
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2d6bff"
      });
    }
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user.uid, { expoPushToken: token } as any);
    }
  } catch {
    // Expo Go does not support remote notifications in SDK 53+
  }
}
