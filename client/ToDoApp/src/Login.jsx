import { useState } from "react";

function Login() {
  return (
    <>
      <div id="LoginContainer">
        <h1>Login</h1>
        <form>
          <label for="username">Username:</label>
          <input type="text" id="username" name="username"></input>

          <label for="password">Password:</label>
          <input type="password" id="password" name="password"></input>
        </form>
      </div>
    </>
  );
}

export default Login;
