import { usePictureContext } from "@/context/PictureContext";
import { useMemo, useState } from "react";

import { Image, SafeAreaView, Text } from "react-native";
type SinglePhotoProps = {
  uri: string;
};

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

  if (!isFriendsWithPicturesReady) {
    return (
      <SafeAreaView className="bg-gray-dark flex w-full h-full justify-center items-center">
        <Text className="text-lg text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-dark flex w-full h-full justify-center items-center">
      <Text className="text-lg text-white">{displayForFriendTag}</Text>
      <Image
        source={{ uri: friendPictures[friendPictureIdx] }}
        className="w-full h-full"
      />
    </SafeAreaView>
  );
};

export default DisplayPhoto;
