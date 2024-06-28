import { loginToBackend } from "@/api/authApi";
import { useUserContext } from "@/context/UserContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const [email, setEmail] = useState("jan.czerwinski@gmail.com");
  const [password, setPassword] = useState("rootroot");

  const [error, setError] = useState("");

  const { setToken, token, setUserName } = useUserContext();

  useEffect(() => {
    if (token !== "") router.replace("/tabs");
  }, [token]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    const { token, error: loginError } = await loginToBackend(email, password);
    if (loginError) {
      setError(loginError);
      return;
    }

    setToken(token);
    router.replace("/tabs");
  };

  return (
    <View className="flex-1 bg-gray-dark justify-center items-center pb-60">
      <KeyboardAvoidingView>
        <Text className="text-white text-4xl mb-8">Login</Text>
        <TextInput
          className="text-white text-lg bg-gray-700 p-4 rounded-lg w-80 mb-4"
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="text-white text-lg bg-gray-700 p-4 rounded-lg w-80 mb-4"
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-500 p-4 rounded-lg w-80 mb-4"
        >
          <Text className="text-white text-center">Submit</Text>
        </TouchableOpacity>
        {error !== "" && <Text className="text-error">{error}</Text>}
        <TouchableOpacity
          onPress={() => router.navigate("/register")}
          className="mt-4"
        >
          <Text className="text-white">Don't have an account? Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/test")}
          className="bg-blue-500 p-4 rounded-lg w-80 mb-4"
        >
          <Text className="text-white text-center">dev menu</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
