import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddJobs from "./pages/AddJobs";
import ListJob from "./pages/ListJob";
import CompanyPage from "./pages/CompanyPage";
import CompanyQuestion from "./pages/CompanyQuestion";
import ListCompanyQs from "./pages/ListCompanyQs";
import RoleQuestion from "./pages/RoleQuestion";
import ListRoleQs from "./pages/ListRoleQs";
import ApplicantsPage from "./pages/ApplicantsPage";

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
          <Route path="/list/company-questions" element={<ListCompanyQs />} />
          <Route path="/role-questions" element={<RoleQuestion />} />
          <Route path="/list/role-questions" element={<ListRoleQs />} />
          <Route path="/applicants" element={<ApplicantsPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
