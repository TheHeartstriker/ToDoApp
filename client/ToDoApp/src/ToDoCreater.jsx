import { useState, useEffect } from "react";

function ToDoCreater() {
  return (
    <>
      {/* <div>
        <h1>Create box center</h1>
      </div> */}
      <div className="Creator">
        <input type="text" id="HeaderTask" placeholder="Task Name" />
        <input type="text" id="DescriptTask" placeholder="Task Description" />
        <button id="Add">Create</button>
        <button id="Reset">Reset</button>
      </div>
    </>
  );
}

export default ToDoCreater;
