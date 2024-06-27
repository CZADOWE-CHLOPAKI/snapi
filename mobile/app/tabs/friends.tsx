import PendingFriendsList from "@/components/PendingFriendsList";
import { useDiscoverFriends } from "@/hooks/useDiscoverFriends";
import { usePendingFriends } from "@/hooks/usePendingFriends";
// import { useSearchNewFriends } from "@/hooks/useSearchNewFriends";
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator, SafeAreaView, TextInput, View } from "react-native";

const Friends = () => {
  const { pendingFriends, isGettingPendingFriends, acceptFriendRequest } =
    usePendingFriends();

  const {
    isDiscoverFriendsLoading,
    discoveredFriends,
    searchString,
    setSearchString,
  } = useDiscoverFriends();

  return (
    <SafeAreaView className="h-full bg-gray-dark py-4">
      <View className="flex flex-row items-center px-6  ">
        <View className=" ">
          <AntDesign name="search1" size={24} color="white" />
        </View>
        <TextInput
          className="text-white  text-xl bg-gray-700 p-4 rounded-lg w-80 "
          placeholder="search for friends by tag"
          placeholderTextColor="#ccc"
          value={searchString}
          onChangeText={setSearchString}
          keyboardType="default"
          autoCapitalize="none"
        />
      </View>
      {searchString === "" ? (
        <View>
          {isGettingPendingFriends ? (
            <View className="h-full w-full flex justify-center items-center">
              <ActivityIndicator color="white" className="pb-60" />
            </View>
          ) : (
            <PendingFriendsList
              label={"friend invitations"}
              displayTrashCan={true}
              tags={pendingFriends}
              onPlusClick={(tag) => acceptFriendRequest(tag)}
            />
          )}
        </View>
      ) : (
        <View>
          {isDiscoverFriendsLoading ? (
            <View className="h-full w-full flex justify-center items-center">
              <ActivityIndicator color="white" className="pb-60" />
            </View>
          ) : (
            <PendingFriendsList
              tags={discoveredFriends}
              onPlusClick={(tag) => {
                console.log("add friend implement this is a mock");
              }}
              label={"found friends"}
              displayTrashCan={false}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Friends;
