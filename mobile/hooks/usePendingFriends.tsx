import { BASE_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";
import { SingleFriendType } from "@/types/friend";
import { useFetcher } from "./useFetcher";

type PendingFriendType = {};

export const usePendingFriends = () => {
  const { token } = useUserContext();
  const { data, isLoading, refresh } = useFetcher<{
    friends: SingleFriendType[];
  }>("/friends/pending", "GET", {});

  const acceptFriendRequest = async (tag: string) => {
    const response = await fetch(`${BASE_URL}/friends/pending/accept/${tag}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friend: tag }),
    });
    const data = await response.json();
    console.log(data);

    refresh();
  };

  return {
    pendingFriends: data?.friends,
    isGettingPendingFriends: isLoading,
    refreshPendingFriends: refresh,
    acceptFriendRequest,
  };
};
