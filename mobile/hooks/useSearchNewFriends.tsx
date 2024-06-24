import { useUserContext } from "@/context/UserContext";
import { useCallback, useEffect, useState } from "react";

export const useSearchNewFriends = () => {
  const [search, setSearch] = useState("");
  const [newFriends, setNewFriends] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { token } = useUserContext();

  const refreshFriends = useCallback(() => {
    setIsSearching(true);
    (async () => {
      //TODO FETCH SEARCH FRIENDs
      setNewFriends(["macias", "to jest zmockowane"]);
      setIsSearching(false);
    })();
  }, [token]);

  useEffect(refreshFriends, [refreshFriends]);

  return { search, isSearching, setSearch, newFriends };
};
