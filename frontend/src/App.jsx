import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import JobPage from "./pages/JobPage";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ViewProfile from "./pages/ViewProfile";
import Company from "./pages/Company";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/viewprofile" element={<ViewProfile />} />
        <Route path="/companies" element={<Company />} />
        <Route path="/jobdetails/:id" element={<JobDetail />} />
      </Routes>
    </>
  );
};

export default App;
