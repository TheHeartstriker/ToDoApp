import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TaskContext, Contexts } from "../taskProvider";
import "./Nav.css";

function Nav() {
  const navigate = useNavigate();

  return (
    <>
      <div className="ContainerHeader">
        <Link to="/container">
          <button id="Home">ToDo's</button>
        </Link>
        <Link to="/create">
          <button id="About">Create</button>
        </Link>
        <Link to="/">
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
