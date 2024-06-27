import { SingleFriendType } from "@/types/friend";
import { useFetcher } from "./useFetcher";

export const useFriends = () => {
  const { data, refresh, isLoading } = useFetcher<{
    friends: SingleFriendType[];
  }>(`/friends`, "GET");

  return {
    friends: data?.friends as SingleFriendType[],
    isFriendsReady: isLoading,
    refreshFriends: refresh,
  };
};
