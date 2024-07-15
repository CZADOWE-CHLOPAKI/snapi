const HOST = "http://192.168.192.11";
const BASE_URL = `https://maciej-szok.dev/api/v1`;

const viewPhoto = async () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjE3MzU0NDMsInN1YiI6IjYifQ.uOrJBAurNGTWj77PsJLD_v3JOORmBgTHNZnADgFjCUU";
  try {
    const response = await fetch(`${BASE_URL}/friends/`, {
      method: "GET",
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

viewPhoto();
