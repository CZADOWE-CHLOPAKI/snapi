import { Canvas, Image, useImage } from "@shopify/react-native-skia";
import { router } from "expo-router";
import { Dimensions } from "react-native";

import { CropHandler } from "@/components/pictureEditor/CropHandler";
import { usePictureContext } from "@/context/PictureContext";
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

type PictureEditorUiProps = {
  onSend: () => void;
  onCropPress: () => void;
  isEditing: boolean;
  onAcceptEdit: () => void;
};

const PictureEditorUi = ({
  onSend,
  onCropPress,
  isEditing,
  onAcceptEdit,
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
          // onPress={onTextPress}
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

const PictureEditor = () => {
  const onSend = () => {
    router.navigate("/tabs/send/sendPicture");
  };
  const { pictureFileLocation } = usePictureContext();
  const image = useImage(pictureFileLocation);
  const [isCropping, setIsCropping] = useState(false);
  const isEditing = useMemo(() => isCropping, [isCropping]);

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const r = width * 0.33;

  const onCropPress = () => {
    setIsCropping((prev) => !prev);
  };

  const onAcceptEdit = () => setIsCropping(false);

  return (
    <View className="w-full h-full">
      <View
        className="absolute  top-0 left-0 w-full h-full flex justify-between "
        style={{ pointerEvents: "box-none" }}
      >
        <PictureEditorUi
          onSend={onSend}
          onCropPress={onCropPress}
          isEditing={isEditing}
          onAcceptEdit={onAcceptEdit}
        />
        {isCropping && <CropHandler />}

        <View className="absolute top-0 ">
          <Canvas style={{ width, height }}>
            <Image
              image={image}
              fit="contain"
              x={0}
              y={0}
              width={width}
              height={height}
            />
          </Canvas>
        </View>
      </View>
    </View>
  );
};

export default PictureEditor;
