import { BASE_API_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

export function useFetcher<T>(
  url: string,
  method: "POST" | "GET",
  body?: unknown
) {
  const [data, setData] = useState<T>();
  const [isLoading, setLoading] = useState(false);
  const { token } = useUserContext();
  const [params, setParams] = useState("");

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  useEffect(() => {
    refresh();
  }, [params]);

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
      let full_url = `${BASE_API_URL}${url}`;
      if (params !== undefined) {
        full_url = `${BASE_API_URL}${url}?q=${params}`;
      }
      console.log("fullurl ", full_url);
      const response = await fetch(full_url, options);
      // console.log("error below?");
      // console.log(await response.text());
      console.log("full_url");
      console.log(full_url);

      console.log("response");
      console.log(response);
      const newData = await response.json();
      console.log("newData");
      console.log(newData);
      setData(newData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [params]);

  return { data, isLoading, refresh, setParams };
}
