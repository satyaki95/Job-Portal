import React, { useEffect, useState } from "react";
import { viewApplicantsPageStyles as s } from "../assets/dummyStyles";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

const ViewApplicantsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId, role, companyName } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);

  // to fetch the applicants apply on that jobId
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${baseURL}/api/application/${jobId}/applicants`,
        );
      } catch (error) {}
    };
  }, []);

  return (
    <div className={s.pageContainer}>
      <button onClick={() => Navigate(-1)} className={s.backButton}>
        <ArrowLeft className={s.backIcon} />
      </button>
    </div>
  );
};

export default ViewApplicantsPage;
