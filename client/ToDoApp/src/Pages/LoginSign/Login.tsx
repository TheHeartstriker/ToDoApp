import { useState, useContext, useRef, useEffect } from "react";
import { handleLogin, handleSignup } from "../../Services/authApi";
import React from "react";

const MAX_INPUT_LENGTH = 50;
const COOLDOWN_TIME = 30000;
const PULSE_TYPES = {
  SUCCESS: "Gpulse",
  ERROR: "Rpulse",
};

function Login() {
  //Stores the username and password
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //Used to see which button name and function to use
  const [login, setLogin] = useState<boolean>(false);
  //Used in junction with the animation to stop the user from clicking multiple times
  const [coolDown, setCoolDown] = useState<boolean>(false);
  const [pulse, setPulse] = useState<string>("");

  //Handling the event changes
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    setter: "username" | "password"
  ): void {
    if (event.target.value.length > MAX_INPUT_LENGTH) {
      alert("Username or password cannot be longer than 50 characters");
      return;
    }
    if (event.target.value.includes(" ")) {
      alert("Password cannot contain spaces");
    } else {
      if (setter === "username") {
        setUsername(event.target.value);
      } else if (setter === "password") {
        setPassword(event.target.value);
      }
    }
  }
  function handlePulse(type: string) {
    setPulse(type);
    setTimeout(() => {
      setPulse("");
    }, 5000);
  }
  //Switch between login and signup
  function handleSwitch() {
    setLogin((prevLogin) => !prevLogin);
  }
  //Handle the server realted to login or signup
  async function handleSignOrLog(
    login: boolean,
    username: string,
    password: string
  ): Promise<void> {
    try {
      if (login) {
        await handleLogin(username, password);
      } else {
        await handleSignup(username, password);
        setCoolDown(true);
      }
      handlePulse(PULSE_TYPES.SUCCESS);
    } catch (error) {
      handlePulse(PULSE_TYPES.ERROR);
      console.error("Error", error);
    }
  }

  useEffect(() => {
    if (coolDown) {
      const timer = setTimeout(() => setCoolDown(false), COOLDOWN_TIME);
      return () => clearTimeout(timer);
    }
  }, [coolDown]);
  return (
    <>
      {/* Outside container */}
      <div className="LogSignContainer">
        {/* The inside container that holds the text boxes */}
        <div className="LogSignPage">
          <div
            className={`input ${
              pulse === PULSE_TYPES.SUCCESS
                ? PULSE_TYPES.SUCCESS
                : pulse === PULSE_TYPES.ERROR
                ? PULSE_TYPES.ERROR
                : ""
            }`}
          >
            <input
              type="text"
              value={username}
              onChange={(event) => handleChange(event, "username")}
              placeholder="Username"
            />
          </div>
          <div
            className={`input ${
              pulse === PULSE_TYPES.SUCCESS
                ? PULSE_TYPES.SUCCESS
                : pulse === PULSE_TYPES.ERROR
                ? PULSE_TYPES.ERROR
                : ""
            }`}
          >
            <input
              type="password"
              value={password}
              onChange={(event) => handleChange(event, "password")}
              placeholder="Password"
            />
          </div>
          <button
            className="loginOrSign"
            onClick={() => handleSignOrLog(login, username, password)}
            disabled={coolDown}
          >
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
