import PendingFriendsList from "@/components/PendingFriendsList";
import { Text, View } from "react-native";

const Friends = () => {
  return (
    <View>
      <View>
        <Text className="text-white font-semibold text-xl  px-4 py-4">
          friend invitations
        </Text>
        <PendingFriendsList />
      </View>
    </View>
  );
};

export default Friends;
