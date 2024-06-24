import { BASE_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";
import { useCallback, useEffect, useState } from "react";

export const usePendingFriends = () => {
  const { token } = useUserContext();

  const [pendingFriends, setPendingFriends] = useState<string[]>([]);
  const [isGettingPendingFriends, setIsGettingPendingFriends] = useState(false);

  const refreshPendingFriends = useCallback(() => {
    setIsGettingPendingFriends(true);
    (async () => {
      const response = await fetch(`${BASE_URL}/friends/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPendingFriends(data?.friends as string[]);
      setIsGettingPendingFriends(false);
    })();
  }, [token]);

  useEffect(refreshPendingFriends, [refreshPendingFriends]);

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
    console.log("ACCEPT FRIEND DATA");
    console.log(data);
    refreshPendingFriends();
  };

  return { pendingFriends, isGettingPendingFriends, acceptFriendRequest };
};
