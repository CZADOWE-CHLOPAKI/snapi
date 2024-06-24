import { usePictureContext } from "@/context/PictureContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";

const PictureEditor = () => {
  const { pictureFileLocation } = usePictureContext();

  const onSend = () => {
    router.navigate("/tabs/send/sendPicture");
  };

  return (
    <View className="relative bg-transparent">
      <View className="absolute  top-0 left-0 w-full h-full flex justify-between  z-10  ">
        {/* <View className="flex flex-row w-full justify-end py-2 px-3 ">
          <TouchableOpacity
            onPress={onTextPress}
            className="w-10 h-10 rounded-full   border-white/80 border-2 flex justify-center items-center"
          >
            <Ionicons name="text" size={20} color="white" />
          </TouchableOpacity>
        </View> */}
        <View className="flex flex-row w-full justify-end py-4 px-6 ">
          <TouchableOpacity onPress={onSend}>
            <Ionicons name="send" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Image source={{ uri: pictureFileLocation }} className="w-full h-full " />
    </View>
  );
};

export default PictureEditor;
