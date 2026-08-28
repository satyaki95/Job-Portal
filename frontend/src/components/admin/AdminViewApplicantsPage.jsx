import { useEffect, useState } from "react";
import { viewApplicantsPageStyles as s } from "../../assets/adminDummyStyles";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Check,
  Mail,
  Phone,
  X,
  Users,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

const AdminViewApplicantsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId: routeJobId } = useParams();
  const { jobId: stateJobId, role, companyName } = location.state || {};
  const jobId = routeJobId || stateJobId;
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const getToken = () =>
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("jobportal_user") || "null")?.token;

  // to fetch the applicants apply on that jobId
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const token = getToken();
        const res = await fetch(
          `${baseURL}/api/application/${jobId}/applicants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();

        if (data.success) {
          const mapped = data.applicants.map((app) => ({
            id: app.applicationId,
            name: app.name,
            email: app.email,
            phone: app.phone,
            appliedForRole: role || data.jobName,
            appliedAt: app.appliedDate,
            resumeFile: app.resume,
            userId: app._id,
            status: app.status || "pending",
          }));
          setFiltered(mapped);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId, role]);

  const updateStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      const response = await fetch(
        `${baseURL}/api/application/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (response.ok) {
        setFiltered((current) =>
          current.map((app) =>
            app.id === applicationId ? { ...app, status } : app,
          ),
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handleViewResume = (resumeUrl, userId) => {
    if (!resumeUrl) return;
    const fullUrl = `${baseURL}api/user/resume/${userId}`;
    const link = document.createElement("a");
    link.href = fullUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={s.pageContainer}>
      <button onClick={() => navigate(-1)} className={s.backButton}>
        <ArrowLeft className={s.backIcon} />
      </button>
      <div className={s.contentWrapper}>
        <div className={s.headerWrapper}>
          <h1 className={s.headerTitle}>
            <Users className={s.headerIcon} />
            <span className={s.headerText}>
              {role ? `${role} - Applicants` : "All Applicants"}
            </span>
          </h1>
        </div>
        {companyName && (
          <div className={s.companyWrapper}>
            <div className={s.companyBadge}>
              <span className={s.companyName}>{companyName}</span>
              <span className={s.activeBadge}>
                <span className={s.activeDot}></span>
                active
              </span>
            </div>
          </div>
        )}
        <div className={s.containerCard}>
          {loading ? (
            <div className={s.loadingWrapper}>
              <div className={s.spinner}></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className={s.emptyWrapper}>
              <div className={s.emptyIconCircle}>
                <Users className={s.emptyIcon} />
              </div>
              <p className={s.emptyTitle}>No applicants found</p>
              <p className={s.emptySubtitle}>
                Try going back or clear filters on the dashboard
              </p>
            </div>
          ) : (
            <div className={s.grid}>
              {filtered.map((app, index) => (
                <div
                  key={app.id}
                  className={s.cardBase}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className={s.cardInner}>
                    <p className={s.applicantName}>{app.name}</p>
                    <div className={s.contactInfo}>
                      <div className={s.contactRow}>
                        <Mail className={s.emailIcon} />
                        <span className={s.emailText}>{app.email}</span>
                      </div>
                      <div className={s.contactRow}>
                        <Phone className={s.phoneIcon} />
                        <span>{app.phone}</span>
                      </div>
                    </div>
                    <div className={s.detailsWrapper}>
                      <div className={s.roleRow}>
                        <Briefcase className={s.roleIcon} />
                        <span className={s.roleBadge}>
                          {app.appliedForRole}
                        </span>
                      </div>
                      <div className={s.dateRow}>
                        <Calendar className={s.dateIcon} />
                        <span className={s.dateBadge}>
                          {formatDate(app.appliedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                        {app.status}
                      </span>
                      <div className="flex gap-2">
                        {app.status !== "accepted" && (
                          <button
                            title="Accept application"
                            disabled={updatingId === app.id}
                            onClick={() => updateStatus(app.id, "accepted")}
                            className="rounded-md bg-emerald-600 p-2 text-white disabled:opacity-50"
                          >
                            <Check size={15} />
                          </button>
                        )}
                        {app.status !== "rejected" && (
                          <button
                            title="Reject application"
                            disabled={updatingId === app.id}
                            onClick={() => updateStatus(app.id, "rejected")}
                            className="rounded-md border border-rose-200 p-2 text-rose-600 disabled:opacity-50"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className={s.buttonWrapper}>
                      {app.resumeFile ? (
                        <button
                          onClick={() =>
                            handleViewResume(app.resumeFile, app.userId)
                          }
                          className={s.resumeButton}
                        >
                          <span className={s.resumeButtonInner}>
                            <svg
                              className={s.resumeIcon}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span>View Resume</span>
                          </span>
                        </button>
                      ) : (
                        <span className={s.noResumeText}>
                          No resume provided
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes gentleFadeUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .group { animation: gentleFadeUp 0.45s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
};

export default AdminViewApplicantsPage;
