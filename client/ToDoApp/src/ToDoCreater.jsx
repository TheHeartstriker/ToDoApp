import { useState, useEffect } from "react";

function ToDoCreater() {
  return (
    <>
      {/* <div>
        <h1>Create box center</h1>
      </div> */}
      <div className="Creator">
        <input type="text" placeholder="Enter your task" />
        <button>Add</button>
      </div>
    </>
  );
}

export default ToDoCreater;
