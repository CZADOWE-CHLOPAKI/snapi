import PendingFriendsList from "@/components/PendingFriendsList";
import { useDiscoverFriends } from "@/hooks/useDiscoverFriends";
import { usePendingFriends } from "@/hooks/usePendingFriends";
import { showToast } from "@/utils/showToast";
import { AntDesign } from "@expo/vector-icons";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

const Friends = () => {
  const { pendingFriends, isGettingPendingFriends, acceptFriendRequest } =
    usePendingFriends();

  const {
    isDiscoverFriendsLoading,
    discoveredFriends,
    searchString,
    setSearchString,
    inviteFriend,
  } = useDiscoverFriends();

  const DiscoveredFriends = () =>
    isDiscoverFriendsLoading || !discoveredFriends ? (
      <View className="h-full w-full flex justify-center items-center">
        <ActivityIndicator color="white" className="pb-60" />
      </View>
    ) : (
      <PendingFriendsList
        friends={discoveredFriends}
        onPlusClick={async (tag) => {
          await inviteFriend(tag);
          showToast("friend invited", "good");
        }}
        label={"found friends"}
        displayTrashCan={false}
      />
    );

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
          {isGettingPendingFriends || !pendingFriends ? (
            <View className="h-full w-full flex justify-center items-center">
              <ActivityIndicator color="white" className="pb-60" />
            </View>
          ) : (
            <PendingFriendsList
              label={"friend invitations"}
              displayTrashCan={true}
              friends={pendingFriends as string[]}
              onPlusClick={async (tag) => {
                await acceptFriendRequest(tag);
                showToast("friend added", "good");
              }}
            />
          )}
        </View>
      ) : (
        <View>
          {searchString.length >= 3 ? (
            <DiscoveredFriends />
          ) : (
            <View className=" p-8  w-full flex justify-center items-center">
              <Text className="text-xl text-white">
                {discoveredFriends?.length !== 0
                  ? "type in at least 3 characters to look for friends"
                  : "no friends with this tag"}
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Friends;
