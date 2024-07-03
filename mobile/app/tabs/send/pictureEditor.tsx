import { usePictureContext } from "@/context/PictureContext";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Expo2DContext from "expo-2d-context";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { router } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";

const onGLContextCreate = (gl: ExpoWebGLRenderingContext) => {
  //@ts-ignore
  var ctx = new Expo2DContext(gl);

  ctx.translate(50, 200);
  ctx.scale(4, 4);
  ctx.fillStyle = "grey";
  ctx.fillRect(20, 40, 100, 100);
  ctx.fillStyle = "white";
  ctx.fillRect(30, 100, 20, 30);
  ctx.fillRect(60, 100, 20, 30);
  ctx.fillRect(90, 100, 20, 30);
  ctx.beginPath();
  ctx.arc(50, 70, 18, 0, 2 * Math.PI);
  ctx.arc(90, 70, 18, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "grey";
  ctx.beginPath();
  ctx.arc(50, 70, 8, 0, 2 * Math.PI);
  ctx.arc(90, 70, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(70, 40);
  ctx.lineTo(70, 30);
  ctx.arc(70, 20, 10, 0.5 * Math.PI, 2.5 * Math.PI);
  ctx.stroke();
  ctx.flush();
};

const PictureEditor = () => {
  const { pictureFileLocation } = usePictureContext();

  const onSend = () => {
    router.navigate("/tabs/send/sendPicture");
  };

  const onTextPress = () => {};
  const nothjing = [GLView, Image];

  return (
    <View className="relative bg-transparent">
      <View className="absolute  top-0 left-0 w-full h-full flex justify-between  z-10  ">
        <View className="flex flex-row w-full absolute p-10 justify-end ">
          <TouchableOpacity
            onPress={onTextPress}
            className="w-10 h-10 rounded-full    border-white/80 border-2 flex justify-center items-center"
          >
            <Ionicons name="text" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex h-full w-full items-end justify-end py-4 px-6 ">
          <TouchableOpacity className="p-6" onPress={onSend}>
            <FontAwesome name="send-o" size={38} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-full h-full">
        <GLView
          className="relative"
          style={{ flex: 1 }}
          onContextCreate={onGLContextCreate}
        />
      </View>
      {/* <View className="w-full h-full relative">
        <Image
          source={{ uri: pictureFileLocation }}
          className="w-full h-full "
        />
      </View> */}
    </View>
  );
};

export default PictureEditor;
