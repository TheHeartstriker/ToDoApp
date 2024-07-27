import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ToDoCreater from "./ToDoCreater";
import Container from "./TodoContainer.jsx";

import Nav from "./Navigator";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Nav />
  </React.StrictMode>
);
