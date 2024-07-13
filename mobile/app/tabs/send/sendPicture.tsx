import { SpinnerPage } from "@/components/SpinnerPage";
import { ThemedText } from "@/components/ThemedText";
import { usePictureContext } from "@/context/PictureContext";
import { useFriends } from "@/hooks/useFriends";
import { useSendPhoto } from "@/hooks/useSendPhoto";
import { SingleFriendType } from "@/types/friend";

import { FontAwesome } from "@expo/vector-icons";

import clsx from "clsx";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type UserProps = {
  onSelected: () => void;
  onDeSelected: () => void;
} & Omit<UserType, "id">;

const User = ({ name: title, onDeSelected, onSelected }: UserProps) => {
  const [selected, setSelected] = useState(false);
  return (
    <TouchableOpacity
      className={clsx(
        "bg-gray-dark px-8 h-12 flex items-center flex-row  justify-between mb-2",
        selected && "bg-gray-medium"
      )}
      onPress={() => {
        selected ? onDeSelected() : onSelected();
        setSelected((prev) => !prev);
      }}
    >
      <ThemedText>{title}</ThemedText>
    </TouchableOpacity>
  );
};

const SendPicture = () => {
  const { sendPhoto } = useSendPhoto();
  const { friends, refreshFriends } = useFriends();
  const { pictureFileLocation } = usePictureContext();
  const [pictureSent, setPictureSent] = useState(false);
  const [onSendPressed, setOnSendPressed] = useState(false);

  const [selectedFriends, setSelectedFriends] = useState<SingleFriendType[]>(
    []
  );

  const onSend = async () => {
    setOnSendPressed(true);
    await sendPhoto(pictureFileLocation, selectedFriends);
    await refreshFriends();
    setPictureSent(true);
    router.replace("/");
  };
  if (!pictureSent && onSendPressed) return <SpinnerPage />;
  return (
    <View className="bg-gray-dark h-full flex justify-center pt-8 ">
      <Text className="text-xl text-white px-4 py-8">send to:</Text>
      <FlatList
        data={friends}
        renderItem={({ item }) => (
          <User
            name={item.tag}
            onSelected={() => {
              setSelectedFriends([...selectedFriends, item]);
            }}
            onDeSelected={() => {
              setSelectedFriends(selectedFriends.filter((tag) => tag !== item));
            }}
            dayCounter={10}
            sentMessagesNotSeen={10}
            recievedMessagesNotSeen={10}
          />
        )}
        keyExtractor={(item) => item.tag}
      />
      <View className="px-6 py-8 flex flex-row justify-end">
        {selectedFriends.length > 0 ? (
          <TouchableOpacity onPress={onSend}>
            <FontAwesome name="send-o" size={32} color="white" />
          </TouchableOpacity>
        ) : (
          <FontAwesome name="send-o" size={32} color="#4d4d4d" />
        )}
      </View>
    </View>
  );
};

export default SendPicture;
