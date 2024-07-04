import { usePictureContext } from "@/context/PictureContext";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { router } from "expo-router";
import Animated from "react-native-reanimated";

import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Expo2DContext from "expo-2d-context";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

// const onGLContextCreate = (gl: ExpoWebGLRenderingContext) => {
//   //@ts-ignore
//   var ctx = new Expo2DContext(gl);

//   ctx.translate(50, 200);
//   ctx.scale(4, 4);
//   ctx.fillStyle = "grey";
//   ctx.fillRect(20, 40, 100, 100);
//   ctx.fillStyle = "white";
//   ctx.fillRect(30, 100, 20, 30);
//   ctx.fillRect(60, 100, 20, 30);
//   ctx.fillRect(90, 100, 20, 30);
//   ctx.beginPath();
//   ctx.arc(50, 70, 18, 0, 2 * Math.PI);
//   ctx.arc(90, 70, 18, 0, 2 * Math.PI);
//   ctx.fill();
//   ctx.fillStyle = "grey";
//   ctx.beginPath();
//   ctx.arc(50, 70, 8, 0, 2 * Math.PI);
//   ctx.arc(90, 70, 8, 0, 2 * Math.PI);
//   ctx.fill();
//   ctx.strokeStyle = "black";
//   ctx.beginPath();
//   ctx.moveTo(70, 40);
//   ctx.lineTo(70, 30);
//   ctx.arc(70, 20, 10, 0.5 * Math.PI, 2.5 * Math.PI);
//   ctx.stroke();
//   ctx.flush();
// };

const PictureEditor = () => {
  const { pictureFileLocation } = usePictureContext();
  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);
  const [ctx, setCtx] = useState<Expo2DContext>();
  const [text, setText] = useState("dupsko");

  const onGLContextCreate = (gl: ExpoWebGLRenderingContext) => {
    //@ts-ignore
    var ctx = new Expo2DContext(gl);
    setCtx(ctx);
  };

  const loadImage = () => {
    // Load the image
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      xPosition.value = e.absoluteX - 120;
      yPosition.value = e.absoluteY - 24;
    })
    .onEnd((e) => {
      console.log("end", e);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xPosition.value },
      { translateY: yPosition.value },
    ],
  }));
  const onSend = () => {
    router.navigate("/tabs/send/sendPicture");
  };

  const onTextPress = () => {};
  const nothjing = [GLView, Image];

  return (
    <GestureHandlerRootView>
      <View
        className="absolute  top-0 left-0 w-full h-full flex justify-between  z-20"
        style={{ pointerEvents: "box-none" }}
      >
        <View className="flex flex-row w-full absolute p-10 justify-end ">
          <TouchableOpacity
            // onPress={onTextPress}
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

      <GestureDetector gesture={panGesture}>
        <Animated.View
          className="z-10 w-60 h-12 bg-gray-dark rounded-lg flex justify-center items-center"
          style={[animatedStyle]}
        >
          <TextInput
            className="text-lg text-white"
            value={text}
            onChangeText={setText}
          />
        </Animated.View>
      </GestureDetector>
      <View
        className="absolute w-full h-full bg-gray-light "
        style={{ pointerEvents: "box-none" }}
      >
        <GLView
          className="relative"
          style={{ flex: 1 }}
          onContextCreate={onGLContextCreate}
        />
      </View>
      <View className="w-full h-full absolute shrink-0">
        <Image
          source={{ uri: pictureFileLocation }}
          className="w-full h-full "
        />
      </View>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  box: {
    height: 120,
    width: 120,
    backgroundColor: "#b58df1",
    borderRadius: 20,
    marginBottom: 30,
  },
});

export default PictureEditor;
