import {
  Canvas,
  Image,
  Text,
  useFont,
  useImage,
} from "@shopify/react-native-skia";
import { router } from "expo-router";
import { Dimensions, Pressable } from "react-native";

import { clamp, CropHandler } from "@/components/pictureEditor/CropHandler";
import { GestureDetectorSwitch } from "@/components/pictureEditor/GestureDetectorSwitch";
import { usePictureContext } from "@/context/PictureContext";
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type PictureEditorUiProps = {
  onSend: () => void;
  onCropPress: () => void;
  isEditing: boolean;
  onAcceptEdit: () => void;
  onTextPress: () => void;
};

const PictureEditorUi = ({
  onSend,
  onCropPress,
  isEditing,
  onAcceptEdit,
  onTextPress,
}: PictureEditorUiProps) => {
  return (
    <View
      className="w-full h-full absolute z-20 "
      style={{ pointerEvents: "box-none" }}
    >
      <View className="flex flex-row w-full absolute py-10 px-4 justify-end ">
        <TouchableOpacity
          onPress={onCropPress}
          className="w-10 h-10 rounded-full    mr-3  border-white/80 border-2 flex justify-center items-center"
        >
          <FontAwesome6 name="crop-simple" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onTextPress}
          className="w-10 h-10 rounded-full   border-white/80 border-2 flex justify-center items-center"
        >
          <Ionicons name="text" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex h-full  w-full items-end justify-end py-4 px-6 ">
        <TouchableOpacity
          className=""
          onPress={() => (isEditing ? onAcceptEdit() : onSend())}
        >
          {isEditing ? (
            <FontAwesome name="check" size={32} color="white" />
          ) : (
            <FontAwesome name="send-o" size={32} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const useTextPan = () => {
  const { width, height } = Dimensions.get("screen");

  const translationX = useSharedValue(100);
  const translationY = useSharedValue(100);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value + 12 },
      { translateY: translationY.value + 12 },
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2 - 10;
      const maxTranslateY = height / 2 - 10;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        0,
        2 * maxTranslateY
      );
    })
    .runOnJS(true);

  // const [x, y] = [translationX.value, translationY.value];
  return {
    pan,
    animatedStyles,

    x: translationX,
    y: translationY,
  };
};

const PictureEditor = () => {
  const onSend = () => {
    router.navigate("/tabs/send/sendPicture");
  };
  const { pictureFileLocation } = usePictureContext();
  const image = useImage(pictureFileLocation);
  const [isCropping, setIsCropping] = useState(false);
  const [isAddingText, setIsAddingText] = useState(false);
  const [addedText, setAddedText] = useState("");
  const [text, setText] = useState("");
  const inputRef = useRef<TextInput>(null);

  const isEditing = useMemo(
    () => isCropping || isAddingText,
    [isCropping, isAddingText]
  );

  const { pan, x, y } = useTextPan();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  useAnimatedReaction(
    () => [x, y],
    () => {}
  );

  const r = width * 0.33;

  const fontSize = 32;
  const font = useFont(
    require("../../../assets/fonts/SpaceMono-Regular.ttf"),
    fontSize
  );

  const onCropPress = () => {
    setIsCropping((prev) => !prev);
  };

  const onTextUiPress = () => {
    setIsAddingText((prev) => !prev);
  };

  const onTextInputPress = () => {
    if (!isAddingText) return;
    inputRef.current?.focus();
    setAddedText("");
    console.log("dpasjdas");
  };

  const onAcceptEdit = () => {
    if (isCropping) setIsCropping(false);
    if (isAddingText) {
      setAddedText(text);
      setIsAddingText(false);
    }
  };

  return (
    <View className="w-full h-full">
      <View
        className="absolute  top-0 left-0 w-full h-full flex justify-between "
        style={{ pointerEvents: "box-none" }}
      >
        <PictureEditorUi
          onSend={onSend}
          onCropPress={onCropPress}
          onTextPress={onTextUiPress}
          isEditing={isEditing}
          onAcceptEdit={onAcceptEdit}
        />
        {isCropping && <CropHandler />}

        <View className="absolute top-0 ">
          <GestureHandlerRootView className="relative">
            <Canvas style={{ width, height }} className="">
              <Image
                image={image}
                fit="contain"
                x={0}
                y={0}
                width={width}
                height={height}
              />
              {addedText !== "" && (
                <Text x={x} y={y} color="white" text={addedText} font={font} />
              )}
            </Canvas>
            <GestureDetectorSwitch gesture={pan} enabled={isAddingText}>
              <View className="absolute ">
                <Pressable onPress={onTextInputPress}>
                  <Canvas
                    style={{ width, height }}
                    className=" absolute w-full h-full bg-error"
                  >
                    {isAddingText && (
                      <Text x={x} y={y} color="white" text={text} font={font} />
                    )}
                  </Canvas>
                </Pressable>
              </View>
            </GestureDetectorSwitch>
          </GestureHandlerRootView>
        </View>
      </View>
      {isAddingText && (
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          style={{
            position: "absolute",
            top: 0,
            left: -10000,
            width: 100,
          }}
        />
      )}
    </View>
  );
};

export default PictureEditor;
