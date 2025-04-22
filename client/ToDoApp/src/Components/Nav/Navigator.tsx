import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TaskContext, Contexts } from "../taskProvider";
import {
  createDraggable,
  createSpring,
  createAnimatable,
  utils,
} from "animejs";
import "./Nav.css";

function Nav() {
  const navigate = useNavigate();
  function initAnimate() {
    const square = createAnimatable(".About", {
      x: 300,
      y: 300,
      ease: "ease(3)",
    });
    return square;
  }

  function onMouseMove(e: MouseEvent) {
    const target = document.querySelector(".About");
    if (!target) return;

    const boundingRect = target.getBoundingClientRect();
    const { clientX, clientY } = e;
    const { top, left, width, height } = boundingRect;

    const dx = clientX - (left + width / 2);
    const dy = clientY - (top + height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    const animatable = initAnimate();

    if (distance < 150) {
      const hw = width / 2;
      const hh = height / 2;
      const x = utils.clamp(clientX - left - hw, -hw, hw);
      const y = utils.clamp(clientY - top - hh, -hh, hh);

      animatable.x(x);
      animatable.y(y);
    } else {
      animatable.x(0);
      animatable.y(0);
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onMouseMove(e);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="ContainerHeader">
        {/* <Link to="/container">
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
        </Link> */}
        <button className="About"></button>
        <button className="Home"></button>
        <button className="Login"></button>
        <button className="Groups"></button>
      </div>
    </>
  );
}

export default Nav;
