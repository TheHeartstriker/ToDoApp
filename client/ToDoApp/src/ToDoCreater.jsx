import { useState, useEffect } from "react";

function ToDoCreater() {
  return (
    <>
      {/* <div>
        <h1>Create box center</h1>
      </div> */}
      <div className="Creator">
        <input type="text" id="Input" placeholder="Enter your task" />
        <button id="Add">Create</button>
        <button id="Reset">Reset</button>
      </div>
    </>
  );
}

export default ToDoCreater;
