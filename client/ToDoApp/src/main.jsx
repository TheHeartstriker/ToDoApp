import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./TaskProvider";

import ToDoCreater from "./ToDoCreater";
import Container from "./TodoContainer.jsx";
import Nav from "./Navigator";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TaskProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Container />} />
          <Route path="/create" element={<ToDoCreater />} />
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  </React.StrictMode>
);
