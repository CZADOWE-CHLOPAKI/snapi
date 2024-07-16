import { registerToBackend } from "@/api/authApi";
import { PageLayout } from "@/components/PageLayout";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Register = () => {
  const [email, setEmail] = useState("jan.czerwinski@gmail.com");
  const [password, setPassword] = useState("rootroot");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const [tag, setTag] = useState("dzbanek");

  const handleSubmit = async () => {
    if (!email || !password || !tag) {
      return;
    }
    setLoading(true);
    console.log("register to backend");
    const { ok, detail } = await registerToBackend(email, password, tag);

    setLoading(false);

    if (ok) {
      router.replace("login");
    } else {
      setError(detail);
      console.error(detail);
      // Handle error
    }
  };

  return (
    <PageLayout>
      <View className="flex-1 bg-gray-dark justify-center items-center pb-60">
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
        <Text className="text-white text-center">
          {loading && "loading ..."}
        </Text>
        {error && <Text className="text-error text-center">{error}</Text>}
      </View>
    </PageLayout>
  );
};

export default Register;
