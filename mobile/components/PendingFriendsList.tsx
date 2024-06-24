import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type PendingFriendsListProps = {
  tags: string[];
  label: string;
  displayTrashCan: boolean;
  onPlusClick: (friend: string) => void;
};
const PendingFriendsList = ({
  label,
  displayTrashCan,
  tags,
  onPlusClick,
}: PendingFriendsListProps) => {
  const UserRow = ({ tag }: { tag: string }) => (
    <View className="flex   flex-row w-full items-center justify-between px-6 py-2 bg-gray-200 ">
      <Text className="text-white text-lg">{tag}</Text>
      <View className="flex flex-row items-center">
        {displayTrashCan && (
          <TouchableOpacity className="mr-6">
            <FontAwesome name="trash-o" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => onPlusClick(tag)}>
          <FontAwesome5 name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      <Text className="text-white font-semibold text-xl  px-4 py-4">
        {label}
      </Text>
      <FlatList
        className="flex-grow-0 "
        data={tags}
        renderItem={({ item }) => <UserRow tag={item} />}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default PendingFriendsList;
