import { BASE_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";
import { SingleFriendType } from "@/types/friend";
// const getImageBlob = async (imageUri: string) => {
//   const response = await fetch(imageUri);
//   const blob = await response.blob();
//   return blob;
// };
import * as FileSystem from "expo-file-system";

const _sendPhoto = async (
  token: string,
  uri: string,
  friends: SingleFriendType[]
) => {
  const friendTags = friends.map((friend) => friend.tag);
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });

  try {
    const response = await fetch(`${BASE_URL}/photos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({ photob64: base64, friends: friendTags }),
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const useSendPhoto = () => {
  const { token } = useUserContext();

  const sendPhoto = async (uri: string, friends: SingleFriendType[]) =>
    await _sendPhoto(token, uri, friends);

  return { sendPhoto };
};
