import { useState, useEffect } from "react";

function Container() {
  console.log("Container component is rendered");

  return (
    <>
      <div id="ContainerHeader">
        <h1>Todo's</h1>
      </div>
      <div className="ToDoContainer">
        <div className="grid-item">Item 1</div>
        <div className="grid-item">Item 2</div>
        <div className="grid-item">Item 3</div>
        <div className="grid-item">Item 4</div>
        <div className="grid-item">Item 5</div>
        <div className="grid-item">Item 6</div>
        <div className="grid-item">Item 7</div>
        <div className="grid-item">Item 8</div>
        <div className="grid-item">Item 9</div>
      </div>
    </>
  );
}

export default Container;
