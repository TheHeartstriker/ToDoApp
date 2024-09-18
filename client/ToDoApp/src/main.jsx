import React from "react";
import ReactDOM from "react-dom/client";
//Routing imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./TaskProvider";
//Component imports
import ToDoCreater from "./ToDoCreater";
import Container from "./TodoContainer.jsx";
import Nav from "./Navigator";
import Login from "./login/LoginSign/Login";
import Groups from "./Folders/groups.jsx";
//CSS imports
import "./Task.css";
import "./login/LoginSign/NavLogin.css";
import "./Folders/Check-Folder.css";
import "./Task.css";
import "./Creator.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TaskProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Container />} />
          <Route path="/create" element={<ToDoCreater />} />
          <Route path="/login" element={<Login />} />
          <Route path="/groups" element={<Groups />} />
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  </React.StrictMode>
);
