import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import JobPage from "./pages/JobPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobPage />} />
      </Routes>
    </>
  );
};

export default App;
