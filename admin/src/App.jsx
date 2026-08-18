import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddJobs from "./pages/AddJobs";
import ListJob from "./pages/ListJob";
import CompanyPage from "./pages/CompanyPage";
import CompanyQuestion from "./pages/CompanyQuestion";

const App = () => {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addjobs" element={<AddJobs />} />
          <Route path="/list/jobs" element={<ListJob />} />
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/company-questions" element={<CompanyQuestion />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
