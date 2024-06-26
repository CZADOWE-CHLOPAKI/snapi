import { BASE_URL } from "@/api/apiSettings";

export const getImageBlob = async (imageUri: string) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  return blob;
};

export const sendPhoto = async (uri: string, friends: string[]) => {
  const imgBody = new FormData();
  imgBody.append("photo", await getImageBlob(uri));
  imgBody.append("friends", JSON.stringify(friends));

  fetch(`${BASE_URL}/photos`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: imgBody,
  });
};
