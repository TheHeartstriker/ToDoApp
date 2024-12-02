import { useState, useContext, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskContext, Contexts } from "../../TaskProvider";
import React from "react";

function Login() {
  //Important context values used across the app
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext) as Contexts;
  //Stores the username and password
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //Used to see which button name and function to use
  const [login, setLogin] = useState<boolean>(false);
  const [signup, setSignup] = useState<boolean>(false);
  //Used in junction with the animation to stop the user from clicking multiple times
  const [CanClick, setCanClick] = useState<boolean>(true);

  const borderRef = useRef<HTMLInputElement>(null);
  //Indicates faliure
  function AnimateBorderRed() {
    const border = borderRef.current;
    if (border) {
      border.classList.add("AnimatePulseRed");
      setCanClick(false);
      setTimeout(() => {
        border.classList.remove("AnimatePulseRed");
        setCanClick(true);
      }, 1500);
    }
  }
  //Indicates success
  function AnimateBorderGreen() {
    const border = borderRef.current;
    if (border) {
      border.classList.add("AnimatePulseGreen");
      setCanClick(false);
      setTimeout(() => {
        setCanClick(true);
        border.classList.remove("AnimatePulseGreen");
      }, 1500);
    }
  }

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
  const handleSwitch = (): void => {
    if (login) {
      setLogin(false);
      setSignup(true);
    } else {
      setLogin(true);
      setSignup(false);
    }
  };
  //Handle the server realted to login or signup
  const handleSignOrLog = (): void => {
    if (!CanClick) {
      return;
    }
    if (login) {
      handleLogin();
    } else {
      handleSignup();
    }
  };
  //Sends the sign up data to be checked by the server and returns a response
  //The response returns the user id and a true value if the sign up was successful that is used in creating tasks
  const handleLogin = async (): Promise<void> => {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        options
      );
      const responseData = await response.json();
      console.log("Response from server:", responseData);
      if (responseData.success) {
        AnimateBorderGreen();
        setIsSignedIn(true);
      } else {
        //If the login fails
        AnimateBorderRed();
        setIsSignedIn(false);
        alert("Incorrect username or password");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //Sends the data to the server to be inserted into the database
  const handleSignup = async (): Promise<void> => {
    if ((await CheckIfInUse()) === true) {
      alert("Username is already in use");
      AnimateBorderRed();
      return;
    }
    let UserId = uuidv4();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
      body: JSON.stringify({ username, password, UserId }),
    };
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/signup`, options);
      setIsSignedIn(true);
      AnimateBorderGreen();
    } catch (error) {
      AnimateBorderRed();
      console.error("Error:", error);
    }
  };
  //Checks if the username is in use by sending the username to the server and returning a response
  async function CheckIfInUse(): Promise<boolean> {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/checkusername`,
        options
      );
      const responseData = await response.json();
      console.log("Name in use", responseData);
      if (responseData) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  return (
    <>
      {/* Outside container */}
      <div className="LogSignContainer">
        {/* The inside container that holds the text boxes */}
        <div className="LogSignPage">
          <div className="Input">
            <input
              ref={borderRef}
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
