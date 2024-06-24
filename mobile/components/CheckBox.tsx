import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";
export const CheckBox = () => {
  const [selected, setSelected] = useState(false);
  return (
    <View className="w-4 h-4 bg-gray-dark border-gray-light border-2">
      {selected && <AntDesign name="check" size={24} color="white" />}
    </View>
  );
};
