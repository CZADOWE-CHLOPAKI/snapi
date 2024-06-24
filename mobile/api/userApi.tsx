const BASE_URL = "http://localhost:8888/api/v1";
export const loginToBackend = async (email: string, password: string) => {
  // Instead of using FormData, directly use URLSearchParams with the data
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  let data;

  try {
    const response = await fetch(`${BASE_URL}/login/access-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // Directly use formData which is now a URLSearchParams instance
      body: formData.toString(),
    });
    data = await response.json();
  } catch (error) {
    console.error(error);
    return { token: null, error: `eroror occruerd ${error}` };
  }
  const token = data?.access_token;

  const error = data?.detail;

  return { token, error };
};

export const registerToBackend = async (
  email: string,
  password: string,
  tag: string
) => {
  const response = await fetch(`${BASE_URL}/users/signup`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email, password, tag }),
  });

  return { ok: response.ok, statusText: response.statusText };
};
