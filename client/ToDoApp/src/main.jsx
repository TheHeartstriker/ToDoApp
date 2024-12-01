import React from "react";
import ReactDOM from "react-dom/client";
//Routing imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./TaskProvider";
//Component imports
import ToDoCreater from "./Tasks/ToDoCreater";
import Container from "./Tasks/TodoContainer";
import Nav from "./Nav/Navigator";
import Login from "./login/LoginSign/Login";
import Groups from "./Folders/groups";
//CSS imports
import "./login/LoginSign/NavLogin.css";
import "./Folders/Check-Folder.css";
import "./Tasks/Task.css";
import "./Tasks/Creator.css";
import "./Nav/Nav.css";
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
