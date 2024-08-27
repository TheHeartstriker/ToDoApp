import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TaskContext } from "./TaskProvider";

function Nav() {
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext);
  const navigate = useNavigate();

  function isSignedInTrue() {
    if (isSignedIn) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (isSignedIn === false) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div id="ContainerHeader">
        <Link to="/">
          <button id="Home">ToDo's</button>
        </Link>
        <Link to="/create">
          <button id="About">Create</button>
        </Link>
      </div>
    </>
  );
}

export default Nav;
