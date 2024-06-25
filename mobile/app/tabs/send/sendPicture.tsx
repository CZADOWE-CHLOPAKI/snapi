import { ThemedText } from "@/components/ThemedText";
import { useFriends } from "@/hooks/useFriends";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

type UserProps = {
  onSelected: () => void;
  onDeSelected: () => void;
} & Omit<UserType, "id">;

const User = ({ name: title, onDeSelected, onSelected }: UserProps) => {
  const [selected, setSelected] = useState(false);
  return (
    <TouchableOpacity
      className={clsx(
        "bg-gray-dark px-4 h-12 flex items-center flex-row  justify-between mb-2",
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { friends, isFriendsReady } = useFriends();

  const onSend = async () => {
    // TODO: send picture to selected users

    router.replace("/");
  };

  return (
    <View className="bg-gray-medium h-full flex justify-center pt-8 ">
      <FlatList
        data={friends}
        renderItem={({ item }) => (
          <User
            name={item}
            onSelected={() => {
              setSelectedTags([...selectedTags, item]);
            }}
            onDeSelected={() => {
              setSelectedTags(selectedTags.filter((tag) => tag !== item));
            }}
            dayCounter={item.dayCounter}
            sentMessagesNotSeen={item.sentMessagesNotSeen}
            recievedMessagesNotSeen={item.recievedMessagesNotSeen}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <View className="px-6 py-8 flex flex-row justify-end">
        {selectedTags.length > 0 ? (
          <TouchableOpacity onPress={onSend}>
            <Ionicons name="send" size={32} color="white" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="send" size={32} color="#4d4d4d" />
        )}
      </View>
    </View>
  );
};

export default SendPicture;
