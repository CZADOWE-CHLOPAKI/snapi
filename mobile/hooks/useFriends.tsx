import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import { useFetcher } from "./useFetcher";

export const useFriends = () => {
  const [friends, setFriends] = useState<string[]>([]);
  const [isFriendsReady, setIsFriendsReady] = useState(false);
  const { token } = useUserContext();
  const { data } = useFetcher(`/friends`, "GET", () => {
    setIsFriendsReady(true);
  });

  return { friends, isFriendsReady };
};
