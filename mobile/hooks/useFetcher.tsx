import { BASE_API_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

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
    }, [])
  );

  // useEffect(() => {
  //   refresh();
  // }, []);

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
        full_url = `${BASE_API_URL}${url}?${params}`;
      }
      // console.log(full_url);
      const response = await fetch(full_url, options);
      // console.log("error below?");
      // console.log(await response.text());

      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, []);

  return { data, isLoading, refresh };
}
