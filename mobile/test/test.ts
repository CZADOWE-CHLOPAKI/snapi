const BASE_URL = "http://192.168.0.242:8888/api/v1";

export const loginToBackend = async (email: string, password: string) => {
  const token = "";
  const error = "";

  const response = await fetch(`${BASE_URL}/login/access-token`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  console.log(data);

  return { token, error };
};

export const registerToBackend = async (email: string, password: string) => {
  const token = "";
  const error = "";

  await fetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return { token, error };
};

loginToBackend("user@example.com", "password");
