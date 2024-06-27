import { BASE_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

export function useFetcher<T>(
  url: string,
  method: "POST" | "GET",
  body?: unknown,
  params?: string
) {
  const [data, setData] = useState<T>();
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
      let full_url = `${BASE_URL}${url}`;
      if (params !== undefined) {
        full_url = `${BASE_URL}${url}?${params}`;
      }
      const response = await fetch(full_url, options);

      console.log("error below?");
      console.log(response);
      const newData = await response.json();
      console.log("newData");
      console.log(newData);

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
}
