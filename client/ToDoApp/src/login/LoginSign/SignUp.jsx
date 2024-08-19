import { useState } from "react";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignup = () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    };

    fetch("http://localhost:5000/api/signup", options)
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
      <div id="SignUpContainer">
        <div className="input-group-signup">
          <label htmlFor="SignupUsername">Username:</label>
          <input
            type="text"
            id="SignupUsername"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="input-group-signup">
          <label htmlFor="SignupPassword">Password:</label>
          <input
            type="password"
            id="SignupPassword"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login" onClick={handleSignup}>
          Signup
        </button>
      </div>
    </>
  );
}

export default SignUp;
