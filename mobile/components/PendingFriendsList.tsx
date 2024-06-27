import { SingleFriendType } from "@/types/friend";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type PendingFriendsListProps = {
  friends: SingleFriendType[];
  label: string;
  displayTrashCan: boolean;
  onPlusClick: (friend: string) => void;
};
const PendingFriendsList = ({
  label,
  displayTrashCan,
  friends,
  onPlusClick,
}: PendingFriendsListProps) => {
  const UserRow = ({ friend }: { friend: SingleFriendType }) => (
    <View className="flex   flex-row w-full items-center justify-between px-6 py-2 bg-gray-200 ">
      <Text className="text-white text-lg">{friend.tag}</Text>
      <View className="flex flex-row items-center">
        {displayTrashCan && (
          <TouchableOpacity className="mr-6">
            <FontAwesome name="trash-o" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => onPlusClick(friend.tag)}>
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
        data={friends}
        renderItem={({ item }) => <UserRow tag={item.tag} />}
        keyExtractor={(item) => item.tag}
      />
    </View>
  );
};

export default PendingFriendsList;
