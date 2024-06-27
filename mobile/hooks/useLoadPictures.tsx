import { SingleFriendType } from "@/types/friend";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
type LoadedPictureType = {
  uri: string;
  friendTag: string;
};

type FriendDownloadPhotoType = {
  photos: FileSystem.DownloadResumable[];
} & Omit<SingleFriendType, "photos">;

const createDownloadResumable = (url: string) => {
  const UUID = Crypto.randomUUID();
  return FileSystem.createDownloadResumable(
    url,
    FileSystem.documentDirectory + `${UUID}.jpeg`,
    {}
  );
};
const downloadPictures = (friends: SingleFriendType[]) => {
  for (const friend of friends) {
    const friendDownload: FriendDownloadPhotoType = {
      streak: friend.streak,
      tag: friend.tag,
      photos: [],
    };

    for (const photo of friend.photos) {
      friendDownload.photos.push(createDownloadResumable(photo));
    }
  }
};

export const useLoadPictures = (friends: SingleFriendType[]) => {
  const [pictures, setPictures] = useState<LoadedPictureType[]>();

  useEffect(() => {}, [friends]);
};
