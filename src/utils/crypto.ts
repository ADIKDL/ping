import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import CryptoJS from "crypto-js";

const KEY_NAME = "ping_aes_key_v1";

async function randomWordArray(bytes: number) {
  const randomBytes = await Crypto.getRandomBytesAsync(bytes);
  return CryptoJS.lib.WordArray.create(randomBytes as any);
}

export async function getOrCreateKey() {
  const existing = await SecureStore.getItemAsync(KEY_NAME);
  if (existing) return existing;
  const key = (await randomWordArray(32)).toString(CryptoJS.enc.Hex);
  await SecureStore.setItemAsync(KEY_NAME, key);
  return key;
}

function deriveChatKey(chatId: string) {
  return CryptoJS.SHA256(chatId).toString(CryptoJS.enc.Hex);
}

export async function encryptPayload(payload: object, chatId?: string) {
  const key = chatId ? deriveChatKey(chatId) : await getOrCreateKey();
  const iv = await randomWordArray(16);
  const plaintext = JSON.stringify(payload);
  const encrypted = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Hex.parse(key), {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return {
    ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    iv: CryptoJS.enc.Base64.stringify(iv),
    version: "v1" as const
  };
}

export async function decryptPayload(
  encrypted: {
  ciphertext: string;
  iv: string;
  version: "v1";
},
  chatId?: string
) {
  const key = chatId ? deriveChatKey(chatId) : await getOrCreateKey();
  const iv = CryptoJS.enc.Base64.parse(encrypted.iv);
  const ciphertext = CryptoJS.enc.Base64.parse(encrypted.ciphertext);
  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
  const decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Hex.parse(key), {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(plaintext) as { text?: string; imageUrl?: string; type: string };
}
