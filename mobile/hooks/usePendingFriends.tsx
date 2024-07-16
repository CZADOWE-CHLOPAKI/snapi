import { useUserContext } from "@/context/UserContext";
import { useFetch } from "./useFetch";
import { useFetcher } from "./useFetcher";

type PendingFriendType = {};

export const usePendingFriends = () => {
  const { token } = useUserContext();
  const { data, isLoading, refresh } = useFetcher<{
    friends: string[];
  }>("/friends/pending/", "GET", {});

  const { fetchPost } = useFetch();

  const acceptFriendRequest = async (tag: string) => {
    const data = await fetchPost(`/friends/pending/accept/${tag}`, {
      friend: tag,
    });
    // const response = await fetch(
    //   `${BASE_API_URL}/friends/pending/accept/${tag}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({ friend: tag }),
    //   }
    // );
    // const data = await response.json();
    console.log("accept friend request response data:");
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
