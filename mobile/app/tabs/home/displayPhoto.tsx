import { BASE_API_URL } from "@/api/apiSettings";
import { PictureCounter } from "@/components/PictureCounter";
import { usePictureContext } from "@/context/PictureContext";
import { useUserContext } from "@/context/UserContext";
import { useFriends } from "@/hooks/useFriends";
import { showToast } from "@/utils/showToast";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
type SinglePhotoProps = {
  uri: string;
};

const SECONDS_TO_DISPLAY_PHOTO = 5;

const CONSUME_PHOTO = true;

// const SinglePhoto = ({ uri }: SinglePhotoProps) => {
//   return (
//     <SafeAreaView className="bg-gray-dark flex w-full h-full justify-center items-center">
//       <Image source={{ uri }} className="w-full h-full" />
//     </SafeAreaView>
//   );
// };

const DisplayPhoto = () => {
  const { friends, refreshFriends } = useFriends();
  const {
    friendsWithPictures,
    displayForFriendTag,
    isFriendsWithPicturesReady,
  } = usePictureContext();
  const { token } = useUserContext();
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

  const friendPicturesServerUri = useMemo(() => {
    if (!friends) return [];
    for (const friend of friends) {
      console.log(friend, displayForFriendTag);
      if (friend.tag === displayForFriendTag) {
        return friend.photos;
      }
    }

    return [];
  }, [displayForFriendTag, friends]);

  const viewPhoto = async (uri: string) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/photos/acknowledge/${uri}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("view photo request response data:");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (CONSUME_PHOTO) {
      if (friendPictureIdx === 0) return;
      viewPhoto(friendPicturesServerUri[friendPictureIdx - 1]);
    }

    if (friendPictureIdx === friendPictures.length) {
      router.back();
    }
  }, [friendPictureIdx]);

  useEffect(() => {
    if (!isFriendsWithPicturesReady) return;
    let timeout: NodeJS.Timeout | null = null;
    const changePhoto = () => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        setFriendPictureIdx((prevIdx) => prevIdx + 1);
        changePhoto();
      }, SECONDS_TO_DISPLAY_PHOTO * 1000);
    };
    changePhoto();

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [displayForFriendTag, isFriendsWithPicturesReady]);

  useEffect(() => {}, [friendPictureIdx]);

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
