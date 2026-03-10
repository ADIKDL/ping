import { Platform } from "react-native";
import { Audio } from "expo-av";

const SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/1082/1082-preview.mp3";

let webAudio: HTMLAudioElement | null = null;
let nativeSound: Audio.Sound | null = null;

export async function playMessageSound() {
  if (Platform.OS === "web") {
    try {
      if (!webAudio) {
        const created = new Audio(SOUND_URL);
        created.volume = 0.5;
        webAudio = created;
      }
      const audio = webAudio;
      if (!audio) return;
      audio.currentTime = 0;
      await audio.play();
    } catch {
      // Ignore playback failures (autoplay, user gesture)
    }
    return;
  }

  try {
    if (!nativeSound) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: SOUND_URL },
        { volume: 0.5, shouldPlay: true }
      );
      nativeSound = sound;
      return;
    }
    await nativeSound.setPositionAsync(0);
    await nativeSound.playAsync();
  } catch {
    // Ignore playback failures
  }
}
