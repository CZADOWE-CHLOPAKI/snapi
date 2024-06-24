import { FontAwesome5 } from "@expo/vector-icons";
import { View } from "react-native";

export const Spinner = () => (
  <View className="animate-spin">
    <FontAwesome5 name="spinner" size={24} color="white" />
  </View>
);
