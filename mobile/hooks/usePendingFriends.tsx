import { BASE_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";
import { useFetcher } from "./useFetcher";

export const usePendingFriends = () => {
  const { token } = useUserContext();
  const { data, isLoading, refresh } = useFetcher(
    "/friends/pending",
    "GET",
    {}
  );
  console.log("usePendingFriends data");
  console.log(data);

  const acceptFriendRequest = async (tag: string) => {
    const response = await fetch(`${BASE_URL}/friends/pending/accept/${tag}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friend: tag }),
    });
    // const data = await response.json();

    refresh();
  };

  return {
    pendingFriends: data?.friends,
    isGettingPendingFriends: isLoading,
    refreshPendingFriends: refresh,
    acceptFriendRequest,
  };
};
