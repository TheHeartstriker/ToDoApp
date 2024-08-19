import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("http://localhost:5000/api/login", options)
      .then((response) => response.text())
      .then((responseData) => {
        console.log("Response from server:", responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div id="LoginContainer">
        <div className="input-group">
          <label htmlFor="LoginUsername">Username:</label>
          <input
            type="text"
            id="LoginUsername"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="LoginPassword">Password:</label>
          <input
            type="password"
            id="LoginPassword"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login" onClick={handleLogin}>
          Login
        </button>
      </div>
    </>
  );
}

export default Login;
