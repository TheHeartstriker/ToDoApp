import { useState, useContext, useRef } from "react";
import { handleLogin, handleSignup } from "../../Services/authApi";
import React from "react";

function Login() {
  //Stores the username and password
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //Used to see which button name and function to use
  const [login, setLogin] = useState<boolean>(false);
  //Used in junction with the animation to stop the user from clicking multiple times
  const [CanClick, setCanClick] = useState<boolean>(true);

  //Handling the event changes
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 49) {
      alert("Username is too long");
      return;
    }
    if (event.target.value.includes(" ")) {
      alert("Username cannot contain spaces");
    } else {
      setUsername(event.target.value);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 49) {
      alert("Password is too long");
      return;
    }
    if (event.target.value.includes(" ")) {
      alert("Password cannot contain spaces");
    } else {
      setPassword(event.target.value);
    }
  };
  //Switch between login and signup
  function handleSwitch() {
    setLogin((prevLogin) => !prevLogin);
  }
  //Handle the server realted to login or signup
  const handleSignOrLog = (): void => {
    if (!CanClick) {
      return;
    }
    if (login) {
      handleLogin(username, password);
    } else {
      handleSignup(username, password);
    }
  };

  return (
    <>
      {/* Outside container */}
      <div className="LogSignContainer">
        {/* The inside container that holds the text boxes */}
        <div className="LogSignPage">
          <div className="Input">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
            />
          </div>
          <div className="Input">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
            />
          </div>
          <button className="loginOrSign" onClick={handleSignOrLog}>
            {login ? "Login" : "Signup"}
          </button>
          <button className="Switch" onClick={handleSwitch}>
            {login ? "Switch to Signup" : "Switch to Login"}
          </button>
        </div>
        <div className="AniWrap">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </>
  );
}

export default Login;
