export async function login() {
  try {
    const data = {
      username: "sagar",
      password: "password",
      employers: "demotest",
    };
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
      sessionStorage.setItem("token", responseJson.token);
    }
  } catch (error) {
    console.log(error);
  }
}
