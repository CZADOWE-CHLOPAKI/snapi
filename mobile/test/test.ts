import fs from "fs";
export const BASE_URL = "http://192.168.182.225:8888/api/v1";

const getImageBlob = async (imageUri: string) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  return blob;
};

const _sendPhoto = async (token: string) => {
  const readFile = fs.readFileSync(
    "/Users/janczerwinski/projekty/snapi/mobile/test/image.jpeg"
  );

  const friendsTagsString = "maciek";
  const imgBody = new FormData();
  console.log("BLOB");
  console.log(readFile);

  //   imgBody.append("photo", new Blob([readFile]));
  imgBody.append(
    "photo",
    JSON.stringify({
      uri: "file:///Users/janczerwinski/projekty/snapi/mobile/test/image.jpeg",
      name: "image.jpeg",
      type: "image/jpeg",
    })
  );

  imgBody.append("friends", friendsTagsString);

  try {
    console.log("friends tags string");
    console.log(friendsTagsString);
    const response = await fetch(`${BASE_URL}/photos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      body: imgBody,
    });
    console.log("send picture");
    console.log(response);
    console.log(await response.json());
  } catch (error) {
    console.error("error ", error);
  }
};

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjAxODI1MDcsInN1YiI6IjEifQ.HfIarng259iBb_0jXJpzB-IH4PIYycfTLdRygrsipLQ";

_sendPhoto(token);
