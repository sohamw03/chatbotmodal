export default async function generateAPI(data, UseCaseId) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/AlchemusAi/Generate/${UseCaseId}`, {
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
