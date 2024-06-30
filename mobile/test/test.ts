const HOST = "http://192.168.192.11";
const BASE_URL = `${HOST}:8888/api/v1`;

const viewPhoto = async (uri: string) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjAxMDM2MTYsInN1YiI6IjIifQ.Fx5fh1oXlHXEzL9ncrpJGb-zw9u_UwOO2GA5BdRJPIM";
  try {
    const response = await fetch(`${BASE_URL}/photos/acknowledge/${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log("view photo request response data:");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

viewPhoto("test");
