import { PictureCounter } from "@/components/PictureCounter";
import { usePictureContext } from "@/context/PictureContext";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
type SinglePhotoProps = {
  uri: string;
};

const SECONDS_TO_DISPLAY_PHOTO = 5;

const SinglePhoto = ({ uri }: SinglePhotoProps) => {
  return (
    <SafeAreaView className="bg-gray-dark flex w-full h-full justify-center items-center">
      <Image source={{ uri }} className="w-full h-full" />
    </SafeAreaView>
  );
};

const DisplayPhoto = () => {
  const {
    friendsWithPictures,
    displayForFriendTag,
    isFriendsWithPicturesReady,
  } = usePictureContext();

  const [friendPictureIdx, setFriendPictureIdx] = useState(0);

  const friendPictures = useMemo(() => {
    if (!friendsWithPictures) return [];
    for (const friend of friendsWithPictures) {
      if (friend.tag === displayForFriendTag) {
        return friend.photos;
      }
    }
    return [];
  }, [displayForFriendTag]);

  useEffect(() => {
    if (!isFriendsWithPicturesReady) return;
    let prevTimeout: NodeJS.Timeout | null = null;
    const changePhoto = () => {
      if (friendPictureIdx === friendPictures.length - 1) return;
      if (prevTimeout) clearTimeout(prevTimeout);

      prevTimeout = setTimeout(() => {
        setFriendPictureIdx((prevIdx) => prevIdx + 1);
        changePhoto();
      }, SECONDS_TO_DISPLAY_PHOTO * 1000);
    };
    changePhoto();
  }, [displayForFriendTag, isFriendsWithPicturesReady]);

  useEffect(() => {
    if (friendPictureIdx === friendPictures.length) {
      router.back();
    }
  }, [friendPictureIdx]);

  if (!isFriendsWithPicturesReady) {
    return (
      <SafeAreaView className="bg-gray-dark flex w-full h-full justify-center items-center">
        <Text className="text-lg text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="absolute bg-gray-dark flex w-full h-full justify-center items-center">
      {/* <View className="absolute w-full h-full"> */}
      <Image
        source={{ uri: friendPictures[friendPictureIdx] }}
        className="w-full h-full"
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        className="flex flex-row items-start justify-end w-full"
      >
        <Text className="text-lg px-4 py-12  text-white">
          <PictureCounter
            currentPictureIndex={friendPictureIdx}
            count={friendPictures.length}
            secondsToDisplayPhoto={SECONDS_TO_DISPLAY_PHOTO}
          />
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default DisplayPhoto;
