export default async function deleteResumeChatAPI(data) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/end_policy_chat/${data.conversation_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseJson = await response.json();
    console.log("Chat deleted:", responseJson);
  } catch (error) {
    console.error("An error occurred while deleting chat:", error);
    throw error;
  }
}
