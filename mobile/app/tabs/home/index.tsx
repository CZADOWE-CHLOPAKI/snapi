import { useFriends } from "@/hooks/useFriends";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import clsx from "clsx";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const { friends, isFriendsReady, refreshFriends } = useFriends();

  useEffect(() => {
    console.log(friends);
  }, []);

  const UserRow = ({ user }: { user: UserType }) => {
    const { name, recievedMessagesNotSeen, dayCounter } = user;

    const MessagesSentNotSeen = () => (
      <View className="flex items-center flex-row ml-auto">
        <View className="pr-2">
          <Text
            className={clsx(
              "text-lg text-white",
              recievedMessagesNotSeen === 0 && "text-gray-light"
            )}
          >
            {recievedMessagesNotSeen}
          </Text>
        </View>
        {recievedMessagesNotSeen > 0 ? (
          <AntDesign name="eyeo" size={24} color="white" />
        ) : (
          <AntDesign name="eyeo" size={24} color="#4d4d4d" />
        )}
      </View>
    );

    const MessagesRecievedNotSeenCount = () => (
      <View className="flex items-center flex-row ml-auto">
        <View className="pr-2">
          <Text
            className={clsx(
              "text-lg text-white",
              recievedMessagesNotSeen === 0 && "text-gray-light"
            )}
          >
            {recievedMessagesNotSeen}
          </Text>
        </View>
        {recievedMessagesNotSeen > 0 ? (
          <AntDesign name="eyeo" size={24} color="white" />
        ) : (
          <AntDesign name="eyeo" size={24} color="#4d4d4d" />
        )}
      </View>
    );

    return (
      <TouchableOpacity
        className={clsx(
          "bg-gray-dark px-6 flex items-center flex-row w-full  justify-start py-2"
        )}
      >
        <Text className="text-white text-lg mr-4">{name}</Text>

        {dayCounter > 0 && (
          <View className="flex flex-row items-center justify-end mr-4">
            <Text className="text-lg text-white  pr-2">{dayCounter}</Text>
            <FontAwesome name="bolt" size={24} color="white" />
          </View>
        )}

        <MessagesRecievedNotSeenCount />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View className="py-4 bg-gray-dark ">
        {isFriendsReady ? (
          <View className="h-full w-full flex justify-center items-center">
            <ActivityIndicator color="white" className="pb-60" />
          </View>
        ) : (
          <View className="flex h-full  justify-start items-center">
            <View>
              <Text className="text-white font-semibold text-xl  px-4 py-4">
                friends
              </Text>
              <TouchableOpacity
                className="bg-white"
                onPress={() => router.navigate("/tabs/home/displayPhoto")}
              >
                <Text className="text-black text-2xl">go to displayphotoo</Text>
              </TouchableOpacity>
              <FlatList
                className="flex-grow-0"
                data={friends}
                renderItem={({ item }) => (
                  <UserRow
                    user={{
                      name: item.tag,
                      dayCounter: item.streak,
                      sentMessagesNotSeen: 10,
                      recievedMessagesNotSeen: item.photos.length,
                    }}
                  />
                )}
                keyExtractor={(item) => item.tag}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
