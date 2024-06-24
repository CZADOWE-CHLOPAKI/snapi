import { registerToBackend } from "@/api/authApi";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const Register = () => {
  const [email, setEmail] = useState("jan.czerwinski@gmail.com");
  const [password, setPassword] = useState("rootroot");

  const [tag, setTag] = useState("dzbanek");

  const handleSubmit = async () => {
    if (!email || !password || !tag) {
      return;
    }

    // Call the registerToBackend function
    const { ok } = await registerToBackend(email, password, tag);

    if (ok) {
      router.replace("login");
    } else {
      // Handle error
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-gray-dark justify-center items-center pb-60">
      <Text className="text-white text-4xl mb-8">Register</Text>
      <TextInput
        className="text-white text-lg bg-gray-700 p-4 rounded-lg w-80 mb-4"
        placeholder="email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="text-white text-lg bg-gray-700 p-4 rounded-lg w-80 mb-4"
        placeholder="unique tag"
        placeholderTextColor="#ccc"
        value={tag}
        onChangeText={setTag}
      />
      <TextInput
        className="text-white text-lg  bg-gray-700 p-4 rounded-lg w-80 mb-4"
        placeholder="password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-500 p-4 rounded-lg w-80 mb-4"
      >
        <Text className="text-white text-center">Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()} className="mt-4">
        <Text className="text-white">Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Register;
