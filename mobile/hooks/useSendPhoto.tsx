import { usePictureContext } from "@/context/PictureContext";

const useSendPhoto = () => {
  const { pictureFileLocation } = usePictureContext();
  const formData = new URLSearchParams();
  formData.append("friends", JSON.stringify(["tag", "tag"]));
  formData.append(
    "image",
    JSON.stringify({
      uri: pictureFileLocation,
      name: "picture_test.jpg",
      type: "image/jpg",
    })
  );
};
