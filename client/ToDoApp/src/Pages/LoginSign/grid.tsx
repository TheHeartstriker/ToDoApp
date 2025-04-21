import { useEffect, useRef, useState } from "react";
import { animate, stagger, utils } from "animejs";
function GridAnimation() {
  const gridSizeRef = useRef({ cols: 0, rows: 0 });
  const isAnimatingRef = useRef(false);
  const animationIdRef = useRef<number | null>(null);
  const animationRef = useRef<any>(null);

  //Creates a single tile with a parent container
  function createTile(gridElement: HTMLElement, columns: number, rows: number) {
    const tileContainer = document.createElement("div");
    tileContainer.className = "tile-container";

    const tile = document.createElement("div");
    tile.className = "tile";

    tileContainer.appendChild(tile);

    gridElement.appendChild(tileContainer);
  }

  function createTiles(
    gridElement: HTMLElement,
    columns: number,
    rows: number
  ) {
    for (let i = 0; i < columns * rows; i++) {
      createTile(gridElement, columns, rows);
    }
  }
  //Handles screen resize manipulating grid size
  function handleResize() {
    const gridElement = document.querySelector(".grid") as HTMLElement;
    if (!gridElement) return;
    // Clear the grid element
    gridElement.innerHTML = "";
    const columns = Math.floor(gridElement.clientWidth / 100);
    const rows = Math.floor(gridElement.clientHeight / 100);
    gridElement.style.setProperty("--cols", columns.toString());
    gridElement.style.setProperty("--rows", rows.toString());

    gridSizeRef.current = { cols: columns, rows: rows };

    createTiles(gridElement, columns, rows);
  }

  //Uses animejs to animate the tiles in a loop
  function animateTiles() {
    const gridElement = document.querySelector(".grid") as HTMLElement;
    if (!gridElement) return;
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const tiles = document.querySelectorAll(".tile");
    const animation = animate(tiles, {
      scale: [{ to: [0, 1.25] }, { to: 0 }],
      boxShadow: [
        { to: "0 0 3rem 0 currentColor" },
        { to: "0 0 0rem 0 currentColor" },
      ],
      delay: stagger(200, {
        grid: [gridSizeRef.current.cols, gridSizeRef.current.rows],
        from: utils.random(
          0,
          gridSizeRef.current.cols * gridSizeRef.current.rows
        ),
      }),
      duration: 1000,
      easing: "inOutElastic",
      onComplete: () => {
        isAnimatingRef.current = false;
        animationIdRef.current = requestAnimationFrame(animateTiles);
      },
    });
    animationRef.current = animation;
  }

  useEffect(() => {
    const gridElement = document.querySelector(".grid") as HTMLElement;
    if (!gridElement) return;
    animateTiles();
    return () => {
      // Clean aniframe and animation instance
      if (animationRef.current) {
        animationRef.current.cancel();
      }
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div className="grid"></div>;
}

export default GridAnimation;
