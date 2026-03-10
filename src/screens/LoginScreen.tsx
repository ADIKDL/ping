import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInWithEmail, signUpWithEmail } from "@/services/auth";

export function LoginScreen() {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-sand-50 dark:bg-ink-900"
    >
      <View className="flex-1 px-6 pt-20">
        <Text className="text-3xl font-semibold text-ink-900 dark:text-white">Welcome back</Text>
        <Text className="mt-2 text-ink-600 dark:text-ink-300">
          Sign in to start a private chat.
        </Text>

        <View className="mt-6 flex-row">
          <TouchableOpacity onPress={() => setAuthMode("signin")} className="mr-4">
            <Text className={`${authMode === "signin" ? "text-ink-900 dark:text-white" : "text-ink-400"}`}>
              Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAuthMode("signup")} className="mr-4">
            <Text className={`${authMode === "signup" ? "text-ink-900 dark:text-white" : "text-ink-400"}`}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>

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
      </View>
    </KeyboardAvoidingView>
  );
}
