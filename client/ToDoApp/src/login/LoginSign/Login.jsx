import { useState, useContext, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskContext } from "../../TaskProvider";

function Login() {
  //Important context values used across the app
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext);
  //Stores the username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //Used to see which button name and function to use
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  //Used in junction with the animation to stop the user from clicking multiple times
  const [CanClick, setCanClick] = useState(true);

  const borderRef = useRef(null);
  //Indicates faliure
  function AnimateBorderRed() {
    const border = borderRef.current;
    border.classList.add("AnimatePulseRed");
    setCanClick(false);
    setTimeout(() => {
      border.classList.remove("AnimatePulseRed");
      setCanClick(true);
    }, 1500);
  }
  //Indicates success
  function AnimateBorderGreen() {
    const border = borderRef.current;
    border.classList.add("AnimatePulseGreen");
    setCanClick(false);
    setTimeout(() => {
      setCanClick(true);
      border.classList.remove("AnimatePulseGreen");
    }, 1500);
  }

  //Handling the event changes
  const handleUsernameChange = (event) => {
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

  const handlePasswordChange = (event) => {
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
  const handleLogin = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch("http://localhost:5000/api/login", options);
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
  const handleSignup = async () => {
    if ((await CheckIfInUse(username)) === true) {
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
      credentials: "include",
      body: JSON.stringify({ username, password, UserId }),
    };
    try {
      await fetch("http://localhost:5000/api/signup", options);
      setIsSignedIn(true);
      AnimateBorderGreen();
    } catch (error) {
      AnimateBorderRed();
      console.error("Error:", error);
    }
  };
  //Checks if the username is in use by sending the username to the server and returning a response
  async function CheckIfInUse() {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/checkUsername",
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
    }
  }

  return (
    <>
      {/* Outside container */}
      <div className="LogSignContainer">
        {/* The inside container that holds the text boxes */}
        <div className="LogSignPage">
          <div className="input-group">
            <input
              ref={borderRef}
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
            />
          </div>
          <div className="input-group">
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
