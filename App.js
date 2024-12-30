import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import UploadProject from "./UploadProject";
import ViewProjects from "./ViewProjects";
import ViewProject from "./ViewProject";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadProject />} />
        <Route path="/view-projects" element={<ViewProjects />} />
        <Route path="/view-project/:id" element={<ViewProject />} />
      </Routes>
    </Router>
  );
}

export default App;
