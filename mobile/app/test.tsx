import { usePendingFriends } from "@/hooks/usePendingFriends";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

const Test = () => {
  const { pendingFriends } = usePendingFriends();

  useEffect(() => {
    console.log("pending friends chagne");
    console.log(pendingFriends);
  }, [pendingFriends]);

  return (
    <View className="w-full h-full bg-gray-dark justify-center items-center">
      <Pressable
        onPress={() => {
          console.log("press");
        }}
      >
        <Text className="text-white text-lg">press</Text>
      </Pressable>
    </View>
  );
};

export default Test;
