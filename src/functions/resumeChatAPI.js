export default async function resumeChatAPI(data) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/do_resume_chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  const responseJson = await response.json();
  return responseJson;
}
