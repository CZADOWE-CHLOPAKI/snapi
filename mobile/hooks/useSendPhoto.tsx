import { BASE_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";
import { SingleFriendType } from "@/types/friend";

const getImageBlob = async (imageUri: string) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  return blob;
};

const _sendPhoto = async (
  token: string,
  uri: string,
  friends: SingleFriendType[]
) => {
  const friendTags = friends.map((friend) => friend.tag);
  const imgBody = new FormData();
  imgBody.append("photo", await getImageBlob(uri));
  imgBody.append("friends", JSON.stringify(friendTags));

  fetch(`${BASE_URL}/photos`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    body: imgBody,
  });
};

export const useSendPhoto = () => {
  const { token } = useUserContext();

  const sendPhoto = async (uri: string, friends: SingleFriendType[]) =>
    await _sendPhoto(token, uri, friends);

  return { sendPhoto };
};
