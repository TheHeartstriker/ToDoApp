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
    const squares = Array.from(document.querySelectorAll(".move-nav-btn"));
    const animatable = squares.map((square) =>
      createAnimatable(square, {
        x: 400,
        y: 400,
        ease: "ease(3)",
      })
    );

    return { squares, animatable };
  }

  function onMouseMove(e: MouseEvent, animatable: any[], squares: any[]) {
    if (!squares || !animatable) return;
    const { clientX, clientY } = e;
    squares.forEach((square: any, index: number) => {
      const boundingRect = square.getBoundingClientRect();
      const { top, left, width, height } = boundingRect;

      const dx = clientX - (left + width / 2);
      const dy = clientY - (top + height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (animatable[index]) {
        // Ensure animatable[index] exists
        if (distance < 150) {
          const hw = width / 2;
          const hh = height / 2;
          const x = utils.clamp(clientX - left - hw, -hw, hw);
          const y = utils.clamp(clientY - top - hh, -hh, hh);

          animatable[index].x(x);
          animatable[index].y(y);
        } else {
          animatable[index].x(0);
          animatable[index].y(0);
        }
      }
    });
  }

  useEffect(() => {
    const { squares, animatable } = initAnimate();
    console.log("squares", squares, animatable);
    const handleMouseMove = (e: MouseEvent) =>
      onMouseMove(e, animatable, squares);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="ContainerHeader">
        <Link to="/container">
          <button className="move-nav-btn">ToDo's</button>
        </Link>
        <Link to="/create">
          <button className="move-nav-btn">Create</button>
        </Link>
        <Link to="/">
          <button className="move-nav-btn">Login</button>
        </Link>
        <Link to="/groups">
          <button className="move-nav-btn">Groups</button>
        </Link>
      </div>
    </>
  );
}

export default Nav;
