import { useEffect, useRef, useState } from "react";
import { animate, stagger, utils } from "animejs";
function GridAnimation() {
  const gridSizeRef = useRef({ cols: 0, rows: 0 });
  function handleResize() {
    const gridElement = document.querySelector(".grid") as HTMLElement;
    if (!gridElement) return;
    // Clear the grid element
    gridElement.innerHTML = "";

    // Calculate the number of columns and rows
    const columns = Math.floor(gridElement.clientWidth / 100);
    const rows = Math.floor(gridElement.clientHeight / 100);
    gridElement.style.setProperty("--cols", columns.toString());
    gridElement.style.setProperty("--rows", rows.toString());

    gridSizeRef.current = { cols: columns, rows: rows };

    // Create tiles directly in the grid element
    createTiles(gridElement, columns, rows);
  }

  function createTile(gridElement: HTMLElement, columns: number, rows: number) {
    // Create a parent container for the tile
    const tileContainer = document.createElement("div");
    tileContainer.className = "tile-container";

    // Create the tile itself
    const tile = document.createElement("div");
    tile.className = "tile";

    // Append the tile to the parent container
    tileContainer.appendChild(tile);

    // Append the parent container to the grid
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

  let isAnimating = false;

  function animateTiles() {
    const gridElement = document.querySelector(".grid") as HTMLElement;
    if (!gridElement) return;
    if (isAnimating) return;
    isAnimating = true;

    const tiles = document.querySelectorAll(".tile");
    animate(tiles, {
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
        isAnimating = false;
        requestAnimationFrame(animateTiles);
      },
    });
  }

  useEffect(() => {
    const gridElement = document.querySelector(".grid") as HTMLElement;
    if (!gridElement) return;

    animateTiles();
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
