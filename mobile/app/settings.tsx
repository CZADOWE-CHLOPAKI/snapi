import { useUserContext } from "@/context/UserContext";
import { useMyProfile } from "@/hooks/useMyProfile";
import { showToast } from "@/utils/showToast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  SafeAreaView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const shareText = async (tag: string) => {
  const text = `Hey! You can add me on Yapper! My tag is ${tag} \n
  Download the app here: https://app_name.com/download`;

  try {
    await Share.share({
      message: text,
    });
  } catch (error) {
    console.error("Error sharing:", error);
    showToast("Error sharing tag. Please try again.", "bad");
  }
};

const Settings = () => {
  const { clear: clearUsers } = useUserContext();
  const { myProfile } = useMyProfile();

  const logOut = () => {
    AsyncStorage.clear();
    clearUsers();
    router.replace("");
  };

  return (
    <SafeAreaView className="h-full bg-gray-dark py-4">
      <View className="h-full flex items-center justify-center pb-40">
        <View className="p-8 text-center">
          <Text className="text-white text-lg">Hi @{myProfile?.tag}!</Text>
        </View>

        <TouchableOpacity
          className="mb-20"
          onPress={() => shareText(myProfile?.tag || "")}
        >
          <Text className="text-white text-lg">share your tag</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mb-20" onPress={() => logOut()}>
          <Text className="text-white text-lg">log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Settings;
