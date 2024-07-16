import { BASE_API_URL } from "@/api/apiSettings";
import { useUserContext } from "@/context/UserContext";

export const useFetch = () => {
  const { token } = useUserContext();

  const fetchGet = async (url: string) => {
    const response = await fetch(`${BASE_API_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  };

  const fetchPost = async (url: string, body: any) => {
    console.log("fetch post");
    const response = await fetch(`${BASE_API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    console.log(response);
    const data = await response.json();
    return data;
  };

  return { fetchGet, fetchPost };
};
