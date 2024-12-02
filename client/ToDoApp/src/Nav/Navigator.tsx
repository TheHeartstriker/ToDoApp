import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TaskContext, Contexts } from "../TaskProvider";

function Nav() {
  //This mostly returns naviagtion html and is used to see if the user is signed in
  //And if not it will redirect to the login page
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext) as Contexts;
  const navigate = useNavigate();

  function isSignedInTrue() {
    if (isSignedIn) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    isSignedInTrue();
    if (isSignedIn === false || isSignedIn === undefined) {
      navigate("/login");
    }
  }, [isSignedIn]);

  return (
    <>
      <div className="ContainerHeader">
        <Link to="/">
          <button id="Home">ToDo's</button>
        </Link>
        <Link to="/create">
          <button id="About">Create</button>
        </Link>
        <Link to="/login">
          <button id="Login">Login</button>
        </Link>
        <Link to="/groups">
          <button id="Groups">Groups</button>
        </Link>
      </div>
    </>
  );
}

export default Nav;
