import { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createAnimatable, utils } from "animejs";
import "./Nav.css";

function Nav() {
  const navigate = useNavigate();
  const frameIdRef = useRef<number | null>(null);

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

  function onMouseMove(mouse: any, animatable: any[], squares: any[]) {
    if (!squares || !animatable) return;
    const { clientX, clientY } = mouse;
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
    let mouse = { x: 0, y: 0 };
    let prevMouse = { x: 0, y: 0 };
    function mouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function update() {
      if (mouse.x !== prevMouse.x || mouse.y !== prevMouse.y) {
        onMouseMove(
          { clientX: mouse.x, clientY: mouse.y },
          animatable,
          squares
        );
        prevMouse.x = mouse.x;
        prevMouse.y = mouse.y;
      }
      frameIdRef.current = requestAnimationFrame(update);
    }

    frameIdRef.current = requestAnimationFrame(update);
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="ContainerHeader">
        <button className="move-nav-btn" onClick={() => navigate("/container")}>
          ToDo's
        </button>
        <button className="move-nav-btn" onClick={() => navigate("/create")}>
          Create
        </button>
        <button className="move-nav-btn" onClick={() => navigate("/")}>
          Login
        </button>
        <button className="move-nav-btn" onClick={() => navigate("/groups")}>
          Groups
        </button>
      </div>
    </>
  );
}

export default Nav;
