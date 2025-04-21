import React from "react";
import ReactDOM from "react-dom/client";
//Routing imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./Components/TaskProvider";
//Component imports
import ToDoCreater from "./Pages/TaskCreator/ToDoCreater";
import Container from "./Pages/TaskDisplay/TodoContainer";
import Nav from "./Components/Nav/Navigator";
import Login from "./Pages/LoginSign/Login";
import Groups from "./Pages/Folders/groups";
//CSS imports
import "./Pages/LoginSign/NavLogin.css";
import "./Pages/Folders/Check-Folder.css";
import "./Pages/TaskDisplay/Task.css";
import "./Pages/TaskCreator/Creator.css";
import "./Components/Nav/Nav.css";
import "./Site.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
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
