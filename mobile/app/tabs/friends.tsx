import PendingFriendsList from "@/components/PendingFriendsList";
import { SafeAreaView, Text, View } from "react-native";

const Friends = () => {
  return (
    <SafeAreaView>
      <View className="h-full bg-gray-dark py-4">
        <View>
          <Text className="text-white font-semibold text-xl  px-4 py-4">
            friend invitations
          </Text>
          <PendingFriendsList />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Friends;
