import { USERS } from "@/mocks/users_mock";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const PendingFriendsList = () => {
  const UserRow = ({ user }: { user: UserType }) => (
    <View className="flex   flex-row w-full items-center justify-between px-6 py-2 bg-gray-200 ">
      <Text className="text-white text-lg">{user.name}</Text>
      <View className="flex flex-row items-center">
        <TouchableOpacity className="mr-6">
          <FontAwesome name="trash-o" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      className="flex-grow-0 "
      data={USERS}
      renderItem={({ item }) => <UserRow user={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};

export default PendingFriendsList;
