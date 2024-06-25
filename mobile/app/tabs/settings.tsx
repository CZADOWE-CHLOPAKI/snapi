import { useUserContext } from "@/context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const Settings = () => {
  const { clear: clearUsers } = useUserContext();
  const logOut = () => {
    AsyncStorage.clear();
    clearUsers();
    router.replace("");
  };
  return (
    <SafeAreaView className="h-full bg-gray-dark py-4">
      <View className="h-full flex items-center justify-center pb-40">
        <TouchableOpacity onPress={() => logOut()}>
          <Text className="text-white text-lg">log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Settings;
