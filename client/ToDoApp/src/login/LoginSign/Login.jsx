import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  //Switch between login and signup
  const handleSwitch = () => {
    if (login) {
      setLogin(false);
      setSignup(true);
    } else {
      setLogin(true);
      setSignup(false);
    }
  };
  //Handle the server realted to login or signup
  const handleSignOrLog = () => {
    if (login) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const handleLogin = () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
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

  const handleSignup = () => {
    let UserId = uuidv4();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, UserId }),
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
      <div id="LogSignContainer">
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
        <button id="login" onClick={handleSignOrLog}>
          {login ? "Login" : "Signup"}
        </button>
        <button id="switch" onClick={handleSwitch}></button>
      </div>
    </>
  );
}

export default Login;
