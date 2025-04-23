import React from "react";
import ReactDOM from "react-dom/client";
//Routing imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./components/taskProvider";
import GridAnimation from "./components/grid/grid";
import AppRoutes from "./routing/indexRoute";
import "./Site.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TaskProvider>
      <BrowserRouter>
        <GridAnimation />
        <AppRoutes />
      </BrowserRouter>
    </TaskProvider>
  </React.StrictMode>
);
