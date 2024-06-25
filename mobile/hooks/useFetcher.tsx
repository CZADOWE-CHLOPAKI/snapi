import { BASE_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

export const useFetcher = (
  url: string,
  method: "POST" | "GET",
  body?: unknown
) => {
  const [data, setData] = useState<any>({});
  const [isLoading, setLoading] = useState(false);
  const { token } = useUserContext();

  useFocusEffect(
    useCallback(() => {
      refresh();
      console.log("focused");
    }, [])
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    console.log("fetching");
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
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  return { data, isLoading, refresh };
};
