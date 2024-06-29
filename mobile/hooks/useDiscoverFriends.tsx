import { useFetcher } from "@/hooks/useFetcher";
import { useState } from "react";

export const useDiscoverFriends = () => {
  const [searchString, setSearchString] = useState("");
  // TODO: Implement search string

  const { data, isLoading, refresh } = useFetcher<{
    friends: string[];
  }>("/friends/discover", "GET", undefined, "q=" + searchString);

  const inviteFriend = async (tag: string) => {
    const response = await fetch(`/friends/invite/${tag}`, {
      method: "POST",
    });
    console.log("inviteFriend response");
    console.log(response);
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
