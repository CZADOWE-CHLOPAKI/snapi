import { useFetcher } from "@/hooks/useFetcher";
import { useState } from "react";

export const useDiscoverFriends = () => {
  const [searchString, setSearchString] = useState("hhh");
  // TODO: Implement search string

  const { data, isLoading, refresh } = useFetcher(
    "/friends/discover",
    "GET",
    undefined,
    "q=" + searchString
  );

  console.log("useDiscoverFriends data");
  console.log(data);

  return {
    isDiscoverFriendsLoading: isLoading,
    discoveredFriends: data?.friends,
    refreshDiscoverFriends: refresh,
    searchString,
    setSearchString,
  };
};
