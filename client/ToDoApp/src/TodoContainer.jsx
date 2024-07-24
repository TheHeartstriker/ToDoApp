import { useState, useEffect } from "react";

function Container() {
  console.log("Container component is rendered");

  return (
    <>
      <div>
        <h1>Todo's</h1>
      </div>
      <div className="ToDoContainer">
        <div class="grid-item">Item 1</div>
        <div class="grid-item">Item 2</div>
        <div class="grid-item">Item 3</div>
        <div class="grid-item">Item 4</div>
        <div class="grid-item">Item 5</div>
        <div class="grid-item">Item 6</div>
        <div class="grid-item">Item 7</div>
        <div class="grid-item">Item 8</div>
        <div class="grid-item">Item 9</div>
      </div>
    </>
  );
}

export default Container;
