import { useEffect, useLayoutEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SquareArrowUp } from "lucide-react";

import Home from "./pages/Home";
import JobPage from "./pages/JobPage";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ViewProfile from "./pages/ViewProfile";
import Saved from "./pages/Saved";
import Contact from "./pages/Contact";
import Applications from "./pages/Applications";

import AdminHome from "./pages/admin/AdminHome";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminListJob from "./pages/admin/AdminListJob";
import AdminApplicantsPage from "./pages/admin/AdminApplicantsPage";
import AdminNavbar from "./components/admin/AdminNavbar";
import AdminManagementPage from "./components/admin/AdminManagementPage";

import EmployerHome from "./pages/employer/EmployerHome";
import EmployerAddJobs from "./pages/employer/EmployerAddJobs";
import EmployerListJob from "./pages/employer/EmployerListJob";
import EmployerApplicantsPage from "./pages/employer/EmployerApplicantsPage";

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

        <Route path="/contact" element={<Contact />} />
        <Route path="/applications" element={<Applications />} />

        <Route path="/saved" element={<Saved />} />
        <Route path="/jobdetails/:id" element={<JobDetail />} />
        <Route path="*" element={null} />

        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/list/jobs" element={<AdminListJob />} />
        <Route path="/admin/applicants" element={<AdminApplicantsPage />} />
        <Route path="/admin/manage" element={<><AdminNavbar /><AdminManagementPage /></>} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/employer" element={<EmployerHome />} />
        <Route path="/employer/addjobs" element={<EmployerAddJobs />} />
        <Route path="/employer/list/jobs" element={<EmployerListJob />} />
        <Route
          path="/employer/applicants"
          element={<EmployerApplicantsPage />}
        />
        <Route path="*" element={null} />
      </Routes>

      <ScrollToTopButton />
    </>
  );
};

export default App;
