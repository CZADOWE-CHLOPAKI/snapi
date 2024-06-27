import { usePictureContext } from "@/context/PictureContext";
import { useEffect } from "react";
import { Image, View } from "react-native";

const DisplayPhoto = () => {
  const { pictureFileLocation } = usePictureContext();

  return (
    <View>
      {pictureFileLocation && (
        <Image
          source={{ uri: pictureFileLocation }}
          className="w-full h-full"
        />
      )}
    </View>
  );
};

export default DisplayPhoto;
