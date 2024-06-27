import { useFetcher } from "./useFetcher";

export type SingleFriendType = {
  photos: string[];
  streak: number;
  tag: string;
};

export const useFriends = () => {
  const { data, refresh, isLoading } = useFetcher(`/friends`, "GET");

  return {
    friends: data?.friends as SingleFriendType[],
    isFriendsReady: isLoading,
    refreshFriends: refresh,
  };
};
