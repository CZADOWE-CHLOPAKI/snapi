import { usePictureContext } from "@/context/PictureContext";
import { useFriends } from "@/hooks/useFriends";
import { useFriendsWithPictures } from "@/hooks/useFriendsWithPictures";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import clsx from "clsx";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const { friends, isFriendsReady } = useFriends();
  useFriendsWithPictures(friends);
  const { setDisplayForFriendTag } = usePictureContext();

  const onFriendPress = (friendTag: string) => {
    router.navigate("/tabs/home/displayPhoto");
    setDisplayForFriendTag(friendTag);
  };

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
        onPress={() => onFriendPress(name)}
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
