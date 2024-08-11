import { useState } from "react";
import { Link } from "react-router-dom";

function Nav() {
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
