import { SingleFriendType } from "@/types/friend";
import React, { ReactNode, createContext, useContext, useState } from "react";

type PictureContextType = {
  pictureFileLocation: string;
  setPictureFileLocation: React.Dispatch<React.SetStateAction<string>>;
  friendsWithPictures: SingleFriendType[] | undefined;
  isFriendsWithPicturesReady: boolean;
  setFriendsWithPictures: React.Dispatch<
    React.SetStateAction<SingleFriendType[] | undefined>
  >;
  setIsFriendsReady: React.Dispatch<React.SetStateAction<boolean>>;
  displayForFriendTag: string;
  setDisplayForFriendTag: React.Dispatch<React.SetStateAction<string>>;
};

const PictureContext = createContext<PictureContextType | undefined>(undefined);

export const PictureContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [pictureFileLocation, setPictureFileLocation] = useState<string>("");

  const [friendsWithPictures, setFriendsWithPictures] =
    useState<SingleFriendType[]>();
  const [isFriendsWithPicturesReady, setIsFriendsReady] = useState(false);

  const [displayForFriendTag, setDisplayForFriendTag] = useState<string>("");
  return (
    <PictureContext.Provider
      value={{
        pictureFileLocation,
        setPictureFileLocation,
        friendsWithPictures,
        setFriendsWithPictures,
        isFriendsWithPicturesReady,
        setIsFriendsReady,
        displayForFriendTag,
        setDisplayForFriendTag,
      }}
    >
      {children}
    </PictureContext.Provider>
  );
};

export const usePictureContext = () => {
  const context = useContext(PictureContext);
  if (context === undefined) {
    throw new Error(
      "usePictureContext must be used within a PictureContextProvider"
    );
  }
  return context;
};
