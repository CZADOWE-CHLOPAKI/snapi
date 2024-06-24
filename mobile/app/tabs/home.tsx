import { BreakLine } from "@/components/BreakLine";
import PendingFriendsList from "@/components/PendingFriendsList";
import { USERS } from "@/mocks/users_mock";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import clsx from "clsx";
import { Link } from "expo-router";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
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
          "bg-gray-dark px-6 h-12 flex items-center flex-row w-full  justify-start mb-2"
        )}
      >
        <Text className="text-white text-xl mr-4">{name}</Text>

        {dayCounter > 0 && (
          <View className="flex flex-row items-center justify-end mr-4">
            <Text className="text-2xl text-white  pr-2">{dayCounter}</Text>
            <FontAwesome name="bolt" size={24} color="white" />
          </View>
        )}

        <MessagesRecievedNotSeenCount />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View className="">
        <View className="flex h-full bg-gray-dark  justify-start items-center">
          <View>
            <Text className="text-white font-semibold text-xl  px-4 py-4">
              friend invitations
            </Text>
            <PendingFriendsList />
          </View>
          <BreakLine />
          <View>
            <Text className="text-white font-semibold text-xl  px-4 py-4">
              friends
            </Text>
            <FlatList
              className="flex-grow-0"
              data={USERS}
              renderItem={({ item }) => <UserRow user={item} />}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>

        <View className="w-full bg-transparent h-20 flex justify-end">
          <View className="flex flex-row justify-end pb-4 pr-6 ">
            <Link href="/camera">
              <AntDesign name="camerao" size={72} color="black" />
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
