import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import ToDoCreater from "./ToDoCreater";
import Container from "./TodoContainer.jsx";
import Nav from "./Navigator";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Container />} />
        <Route path="/create" element={<ToDoCreater />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
