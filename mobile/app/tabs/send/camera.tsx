import { usePictureContext } from "@/context/PictureContext";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Camera = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const { pictureFileLocation, setPictureFileLocation } = usePictureContext();

  useEffect(() => {
    console.log("pictureFilelocation ", pictureFileLocation);
  }, [pictureFileLocation]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className={"flex-1 justify-center"}>
        <Text className={"text-center"}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      if (photo) {
        setPictureFileLocation(photo.uri);
        router.navigate("/tabs/send/pictureEditor");
      } else {
        console.error("No photo taken");
      }

      console.log(photo);
    }
  }

  const FlipCamera = () => {
    return (
      <TouchableOpacity
        className={"h-full  aspect-square flex justify-center items-center  "}
        onPress={toggleCameraFacing}
      >
        <MaterialIcons
          name={
            Platform.OS === "ios" ? "flip-camera-ios" : "flip-camera-android"
          }
          size={36}
          color="white"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className={"flex-1 justify-center"}>
      <CameraView className={"flex-1"} facing={facing} ref={cameraRef}>
        <View className="flex justify-end h-full py-14 px-12  ">
          <View className={"flex flex-row justify-between  h-14"}>
            <View className="h-full aspect-square" />
            <TouchableOpacity
              className={"aspect-square h-full  bg-white rounded-full"}
              onPress={takePicture}
            />
            <FlipCamera />
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

export default Camera;
