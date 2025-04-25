import ToDoCreater from "../pages/taskCreator/toDoCreater";
import Container from "../pages/taskDisplay/todoContainer";
import Nav from "../components/nav/Navigator";
import Login from "../pages/loginSign/login";
import Groups from "../pages/folders/groups";
//Routing imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/container" element={<Container />} />
        <Route path="/create" element={<ToDoCreater />} />
        <Route path="/" element={<Login />} />
        <Route path="/groups" element={<Groups />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
