import { useFetcher } from "./useFetcher";

export const useFriends = () => {
  const { data, refresh, isLoading } = useFetcher(`/friends`, "GET");

  return {
    friends: data?.friends,
    isFriendsReady: isLoading,
    refreshFriends: refresh,
  };
};
