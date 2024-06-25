const baseUrl = "http://localhost:8888/api/v1/friends";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTk5NTM4MjIsInN1YiI6IjIifQ.8gUM2JIflr6kzsTGIWB1NmnIMBgeIYJukMQCu7Il8N4";

async function fetchFriends() {
  try {
    const response = await fetch(baseUrl, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
}

fetchFriends();
