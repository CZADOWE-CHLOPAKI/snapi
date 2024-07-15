import { loginToBackend } from "@/api/authApi";
import { AppleAuth } from "@/components/AppleAuth";
import { PageLayout } from "@/components/PageLayout";
import { useUserContext } from "@/context/UserContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const [email, setEmail] = useState("jan.ignacy.czerwinski@gmail.com");
  const [password, setPassword] = useState("ryyba123");

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
    console.log("logging in....");
    const { token, error: loginError } = await loginToBackend(email, password);
    console.log("logged in");

    if (loginError) {
      setError(loginError);
      return;
    }

    setToken(token);
    router.replace("/tabs");
  };

  return (
    <PageLayout>
      <PageLayout header="Login">
        <View className="flex-1 bg-gray-dark justify-center items-center pb-60">
          <KeyboardAvoidingView>
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

            <View className="flex flex-row justify-center items-center">
              {Platform.OS === "ios" && <AppleAuth />}
              {error !== "" && <Text className="text-error">{error}</Text>}
            </View>
            <TouchableOpacity
              onPress={() => router.navigate("/register")}
              className="mt-4 text-center"
            >
              <Text className="text-white">
                Don't have an account? Register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.navigate("/test")}
              className="bg-blue-500 p-4 rounded-lg w-80 mb-4"
            >
              <Text className="text-white text-center">dev menu</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </PageLayout>
    </PageLayout>
  );
};

export default Login;
