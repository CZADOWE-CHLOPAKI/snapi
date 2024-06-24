import { BASE_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";
import { useCallback, useEffect, useState } from "react";

export const useFetcher = (
  url: string,
  method: "POST" | "GET",
  callback: () => void,
  body?: unknown
) => {
  const [refresher, setRefresher] = useState(false);
  const refresh = () => setRefresher(!refresher);
  const [data, setData] = useState<any>({});
  const [isLoading, setLoading] = useState(false);
  const { token } = useUserContext();

  const fetcher = useCallback(async () => {
    setLoading(true);
    const options: { [k: string]: any } = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        method,
      },
    };
    if (method === "POST") {
      options["body"] = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${BASE_URL}${url}`, options);
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
    setData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetcher();
  }, [refresher]);

  return { data, isLoading, refresh };
};
