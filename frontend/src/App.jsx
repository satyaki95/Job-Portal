import { useEffect, useLayoutEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SquareArrowUp } from "lucide-react";

import Home from "./pages/Home";
import JobPage from "./pages/JobPage";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ViewProfile from "./pages/ViewProfile";
import Company from "./pages/Company";
import Roles from "./pages/Roles";
import Saved from "./pages/Saved";
import Contact from "./pages/Contact";

import AdminHome from "./pages/admin/AdminHome";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminAddJobs from "./pages/admin/AdminAddJobs";
import AdminListJob from "./pages/admin/AdminListJob";
import AdminCompanyPage from "./pages/admin/AdminCompanyPage";
import AdminCompanyQuestion from "./pages/admin/AdminCompanyQuestion";
import AdminListCompanyQs from "./pages/admin/AdminListCompanyQs";
import AdminRoleQuestion from "./pages/admin/AdminRoleQuestion";
import AdminListRoleQs from "./pages/admin/AdminListRoleQs";
import AdminApplicantsPage from "./pages/admin/AdminApplicantsPage";

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        try {
          window.history.scrollRestoration = prev;
        } catch (e) {}
      };
    }
  }, []);

  useLayoutEffect(() => {
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (e) {}
  }, [pathname]);

  return null;
};

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.pageYOffset > 300);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center cursor-pointer rounded-full bg-blue-300 shadow-xl hover:bg-blue-400 active:scale-95 transition-all duration-300"
    >
      <SquareArrowUp size={22} />
    </button>
  );
};

const App = () => {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/viewprofile" element={<ViewProfile />} />

        <Route path="/companies" element={<Company />} />
        <Route path="/companies/:companyId" element={<Company />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/roles" element={<Roles />} />
        <Route path="/roles/:roleSlug" element={<Roles />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/jobdetails/:id" element={<JobDetail />} />
        <Route path="*" element={null} />
      </Routes>

      <div className=" min-h-screen w-full overflow-x-hidden antialiased">
        <div className=" min-w-0">
          <Routes>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/addjobs" element={<AdminAddJobs />} />
            <Route path="/admin/list/jobs" element={<AdminListJob />} />
            <Route path="/admin/companies" element={<AdminCompanyPage />} />
            <Route
              path="/admin/company-questions"
              element={<AdminCompanyQuestion />}
            />
            <Route
              path="/admin/list/company-questions"
              element={<AdminListCompanyQs />}
            />
            <Route
              path="/admin/role-questions"
              element={<AdminRoleQuestion />}
            />
            <Route
              path="/admin/list/role-questions"
              element={<AdminListRoleQs />}
            />
            <Route path="/admin/applicants" element={<AdminApplicantsPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="*" element={null} />
          </Routes>
        </div>
      </div>

      <ScrollToTopButton />
    </>
  );
};

export default App;
