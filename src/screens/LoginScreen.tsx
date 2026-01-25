import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "@/backend/firebase";
import { signInWithEmail, signInWithPhone, signUpWithEmail, confirmPhoneCode } from "@/services/auth";

export function LoginScreen() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const handleEmailSignIn = async () => {
    if (!email || !password) return;
    try {
      setError(null);
      if (authMode === "signup") {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err?.message ?? "Unable to continue.");
    }
  };

  const handlePhoneStart = async () => {
    if (!phone) return;
    setError(null);
    try {
      const confirmation = await signInWithPhone(phone, recaptchaVerifier.current!);
      setVerificationId(confirmation.verificationId);
    } catch (err: any) {
      setError(err?.message ?? "Unable to send code.");
    }
  };

  const handlePhoneConfirm = async () => {
    if (!verificationId || !code) return;
    setError(null);
    try {
      await confirmPhoneCode(verificationId, code);
    } catch (err: any) {
      setError(err?.message ?? "Invalid code.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-sand-50 dark:bg-ink-900"
    >
      <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />
      <View className="flex-1 px-6 pt-20">
        <Text className="text-3xl font-semibold text-ink-900 dark:text-white">Welcome back</Text>
        <Text className="mt-2 text-ink-600 dark:text-ink-300">
          Sign in to start a private chat.
        </Text>

        <View className="mt-6 flex-row">
          <TouchableOpacity onPress={() => setMode("email")} className="mr-4">
            <Text className={`${mode === "email" ? "text-ink-900 dark:text-white" : "text-ink-400"}`}>
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode("phone")}
            className="mr-4">
            <Text className={`${mode === "phone" ? "text-ink-900 dark:text-white" : "text-ink-400"}`}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {mode === "email" ? (
          <View className="mt-4 flex-row">
            <TouchableOpacity onPress={() => setAuthMode("signin")} className="mr-4">
              <Text className={`${authMode === "signin" ? "text-ink-900 dark:text-white" : "text-ink-400"}`}>
                Sign in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAuthMode("signup")}
              className="mr-4">
              <Text className={`${authMode === "signup" ? "text-ink-900 dark:text-white" : "text-ink-400"}`}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {mode === "email" ? (
          <View className="mt-8">
            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              className="mb-4 rounded-2xl bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white"
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="mb-6 rounded-2xl bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white"
            />
            <TouchableOpacity onPress={handleEmailSignIn} className="rounded-2xl bg-brand-500 py-4">
              <Text className="text-center text-white font-semibold">
                {authMode === "signup" ? "Create account" : "Continue"}
              </Text>
            </TouchableOpacity>
            {error ? (
              <Text className="mt-3 text-xs text-red-500">{error}</Text>
            ) : null}
          </View>
        ) : (
          <View className="mt-8">
            <TextInput
              placeholder="+1 555 000 1234"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              className="mb-4 rounded-2xl bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white"
            />
            {verificationId ? (
              <TextInput
                placeholder="Verification code"
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                className="mb-4 rounded-2xl bg-white dark:bg-ink-800 px-4 py-3 text-ink-900 dark:text-white"
              />
            ) : null}
            <TouchableOpacity
              onPress={verificationId ? handlePhoneConfirm : handlePhoneStart}
              className="rounded-2xl bg-brand-500 py-4"
            >
              <Text className="text-center text-white font-semibold">
                {verificationId ? "Confirm" : "Send code"}
              </Text>
            </TouchableOpacity>
            {error ? (
              <Text className="mt-3 text-xs text-red-500">{error}</Text>
            ) : (
              <Text className="mt-3 text-xs text-ink-500 dark:text-ink-300">
                Phone auth requires a real device and works in Expo Go.
              </Text>
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
