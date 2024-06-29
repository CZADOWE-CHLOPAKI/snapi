import { PictureCounter } from "@/components/PictureCounter";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
const Square = () => <View className="bg-white w-5 h-5 rotate-45" />;

const Test = () => {
  const [currentPictureIndex, setCurrentPictureIndex] = useState(6);
  return (
    <View className="w-full h-full bg-gray-dark flex justify-center items-center  ">
      {/* <AnimatedClock /> */}
      <TouchableOpacity
        onPress={() => {
          console.log("dupa");
          setCurrentPictureIndex(currentPictureIndex - 1);
        }}
      >
        <Text className="text-lg text-white">asdksd</Text>
      </TouchableOpacity>
      <View className="w-12 mt-20 h-12 flex justify-center items-center border-white  rounded-full ">
        <PictureCounter currentPictureIndex={currentPictureIndex} count={4} />
      </View>
    </View>
  );
};

export default Test;
