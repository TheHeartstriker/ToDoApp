import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskContext } from "../../TaskProvider";

function Login() {
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext);
  const { userId, setUserId } = useContext(TaskContext);
  //Stores the username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //Used to see which button name and function to use
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  //Handling the event changes
  const handleUsernameChange = (event) => {
    if (event.target.value.length > 49) {
      alert("Username is too long");
      return;
    } else {
      setUsername(event.target.value);
    }
  };

  const handlePasswordChange = (event) => {
    if (event.target.value.length > 49) {
      alert("Password is too long");
      return;
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
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch("http://localhost:5000/api/login", options);
      const responseData = await response.json();
      console.log("Response from server:", responseData);
      if (responseData.success) {
        setIsSignedIn(true);
        setUserId(responseData.Id);
      } else {
        setIsSignedIn(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //Sends the data to the server to be inserted into the database
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
      await fetch("http://localhost:5000/api/signup", options);
      setIsSignedIn(true);
      setUserId(UserId);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {/* Outside container */}
      <div id="LogSignContainer">
        {/* The inside container that holds the text boxes */}
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
          <button id="loginOrSign" onClick={handleSignOrLog}>
            {login ? "Login" : "Signup"}
          </button>
          <button id="switch" onClick={handleSwitch}></button>
        </div>
      </div>
    </>
  );
}

export default Login;
