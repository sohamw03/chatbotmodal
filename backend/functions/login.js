export async function login(payload) {
  try {
    const data = payload;
    const response = await fetch(`${process.env.REACT_APP_API_URL}/Auth/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ApiKey: `${process.env.REACT_APP_API_KEY}`,
        secretkey: `${process.env.REACT_APP_API_SECRET_KEY}`,
      },
      body: JSON.stringify(data),
    });
    const responseJson = await response.json();
    // console.log(responseJson);
    if (responseJson.token) {
      return responseJson.token;
    }
  } catch (error) {
    console.log(error);
  }
}
