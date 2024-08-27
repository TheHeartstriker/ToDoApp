import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskContext } from "../../TaskProvider";

function Login() {
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext);
  const { userId, setUserId } = useContext(TaskContext);

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

  const handleLogin = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch("http://localhost:5000/api/login", options);
      const responseData = await response.json();
      console.log("Response from server:", responseData);
      if (responseData.success) {
        setIsSignedIn(true);
        setUserId(responseData.Id);
        console.log("User ID:", userId);
      } else {
        setIsSignedIn(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSignup = async () => {
    let UserId = uuidv4();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, UserId }),
    };
    try {
      const response = await fetch("http://localhost:5000/api/signup", options);
      const responseData = await response.text();
      setUserId(UserId);
      console.log("Response from server:", responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div id="LogSignContainer">
        <div id="LogSignPage">
          <div className="input-group">
            <input
              type="text"
              id="LoginUsername"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="LoginPassword"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
            />
          </div>
          <button id="login" onClick={handleSignOrLog}>
            {login ? "Login" : "Signup"}
          </button>
          <button id="switch" onClick={handleSwitch}></button>
        </div>
      </div>
    </>
  );
}

export default Login;
