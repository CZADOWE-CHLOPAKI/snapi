import { PICTURE_URL } from "@/api/apiSettings";
import { usePictureContext } from "@/context/PictureContext";
import { SingleFriendType } from "@/types/friend";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";
import { useEffect } from "react";
type LoadedPictureType = {
  uri: string;
  friendTag: string;
};

// type FriendDownloadPhotoType = {
//   photos: FileSystem.DownloadResumable[];
// } & Omit<SingleFriendType, "photos">;

const createDownloadResumable = (url: string) => {
  const UUID = Crypto.randomUUID();
  return FileSystem.createDownloadResumable(
    url,
    FileSystem.documentDirectory + `${UUID}.jpeg`,
    {}
  );
};
const downloadPictures = async (friends: SingleFriendType[]) => {
  const friendsWithUris: SingleFriendType[] = [];
  for (const friend of friends) {
    const friendDownload: SingleFriendType = {
      streak: friend.streak,
      tag: friend.tag,
      photos: [],
    };

    for (const photo of friend.photos) {
      const url = `${PICTURE_URL}/${photo}`;
      const downloadResumable = createDownloadResumable(url);
      let download;
      try {
        download = await downloadResumable.downloadAsync();
      } catch (e) {
        console.error(e);
      }

      if (download) {
        const uri = download.uri;
        friendDownload.photos.push(uri);
      }
    }
    friendsWithUris.push(friendDownload);
  }

  return friendsWithUris;
};

export const useFriendsWithPictures = (initialFriends: SingleFriendType[]) => {
  // const [friendsWithPictures, setFriends] = useState<SingleFriendType[]>();
  // const [isFriendsWithPicturesReady, setIsFriendsReady] = useState(false);
  const {
    friendsWithPictures,
    isFriendsWithPicturesReady,
    setFriendsWithPictures,
    setIsFriendsReady,
  } = usePictureContext();

  const friendPictureCountChanged = (
    prev: SingleFriendType[],
    curr: SingleFriendType[]
  ) =>
    prev.map((friend) => `${friend.tag} ${friend.photos.length}`).join("|") !==
    curr.map((friend) => `${friend.tag} ${friend.photos.length}`).join("|");

  useEffect(() => {
    if (!initialFriends) return;
    if (
      friendsWithPictures &&
      !friendPictureCountChanged(friendsWithPictures, initialFriends)
    )
      return;

    setIsFriendsReady(false);
    (async () => {
      const newFriendsWithPictures = await downloadPictures(initialFriends);
      setFriendsWithPictures([...newFriendsWithPictures]);
      setIsFriendsReady(true);
    })();

    //TODO cache the pictures
  }, [initialFriends]);

  return {
    friendsWithPictures,
    isFriendsWithPicturesReady,
  };
};
