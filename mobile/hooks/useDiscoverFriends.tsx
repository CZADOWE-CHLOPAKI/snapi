import { useFetcher } from "@/hooks/useFetcher";
import { useState } from "react";
import { useFetch } from "./useFetch";
export const useDiscoverFriends = () => {
  const [searchString, setSearchString] = useState("");
  // TODO: Implement search string

  const { data, isLoading, refresh } = useFetcher<{
    friends: string[];
  }>("/friends/discover/", "GET", undefined, "q=" + searchString);
  const { fetchPost } = useFetch();

  const inviteFriend = async (tag: string) => {
    await fetchPost(`/friends/invite/${tag}`, {});
  };

  return {
    isDiscoverFriendsLoading: isLoading,
    discoveredFriends: data?.friends,
    refreshDiscoverFriends: refresh,
    searchString,
    setSearchString,
    inviteFriend,
  };
};
