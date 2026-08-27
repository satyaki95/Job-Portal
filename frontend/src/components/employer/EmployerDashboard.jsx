import { useEffect, useState } from "react";
import { Briefcase, Users, Plus, MapPin, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dashboardStyles as s, statColors } from "../../assets/adminDummyStyles";

const baseURL = import.meta.env.VITE_BASE_URL;
const token = () => localStorage.getItem("token") || JSON.parse(localStorage.getItem("jobportal_user") || "null")?.token;

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalJobs: 0, closedJobs: 0, totalApplications: 0, totalCompanies: 0 });
  const [jobs, setJobs] = useState([]);
  const [closingJobId, setClosingJobId] = useState(null);
  const [postingStatus, setPostingStatus] = useState("active");

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${baseURL}/api/employer/dashboard`, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        const dashboardData = await response.json();
        if (isMounted && dashboardData.success) {
          setStats(dashboardData.stats);
          setJobs(dashboardData.jobs || []);
        }
      } catch {
        // Keep the current dashboard data when a refresh fails.
      }
    };

    fetchDashboard();
    const refreshInterval = window.setInterval(fetchDashboard, 10000);
    window.addEventListener("focus", fetchDashboard);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", fetchDashboard);
    };
  }, []);

    const handleCloseJob = async (jobId) => {
      if (!window.confirm("Are you sure you want to close this role?")) return;

      setClosingJobId(jobId);
      try {
        const response = await fetch(`${baseURL}/api/employer/jobs/${jobId}/close`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token()}` },
        });
        const data = await response.json();

        if (data.success) {
          setJobs((currentJobs) =>
            currentJobs.map((job) => (job._id === jobId ? data.job : job)),
          );
          setStats((currentStats) => ({
            ...currentStats,
            closedJobs: currentStats.closedJobs + 1,
          }));
        }
      } finally {
        setClosingJobId(null);
      }
    };

  const cards = [
    { label: "Total Jobs", value: stats.totalJobs, icon: Briefcase, colors: statColors.blue },
    { label: "Closed Jobs", value: stats.closedJobs, icon: Briefcase, colors: statColors.rose },
    { label: "Total Applicants", value: stats.totalApplications, icon: Users, colors: statColors.emerald },
  ];
  const activeJobs = jobs.filter((job) => (job.status || "active") === "active");
  const filteredRecentJobs = jobs.filter(
    (job) => (job.status || "active") === postingStatus,
  );
  return <main className={s.container}><div className={s.contentWrapper}>
    <div className={s.headerContainer}><div><h1 className={s.headerTitle}>Employer Dashboard</h1><p className={s.headerSubtitle}> <Briefcase className={s.headerIcon} /> <span>Overview of your roles and applicants</span></p></div><button onClick={() => navigate("/employer/addjobs")} className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-700"><Plus size={18} />Create a job</button></div>
    <div className={s.statsGrid}>{cards.map(({ label, value, icon: Icon, colors }) => <div key={label} className={s.statCard}><div className={s.statCardOverlay}></div><div className={s.statCardContent}><div className={s.statCardTextContainer}><p className={s.statCardLabel}>{label}</p><p className={s.statCardValue}>{value ?? 0}</p></div><div className={`${s.statCardIconWrapper} ${colors.bgLight} bg-linear-to-br ${colors.gradient}`}><Icon className={s.statCardIcon} strokeWidth={1.8} /></div></div></div>)}</div>
    <section className={s.jobsSection}><div className={s.jobsHeader}><h2 className={s.jobsTitle}><Briefcase className={s.jobsTitleIcon} />Active Roles</h2><div className={s.jobsFilterContainer}><div className={s.jobsCount}>{activeJobs.length} {activeJobs.length === 1 ? "role" : "roles"}</div></div></div>{activeJobs.length ? <div className={s.jobsGrid}>{activeJobs.slice(0, 6).map((job) => <div key={job._id} className={s.jobCard}><div className={s.jobCardOverlay}></div><div className={s.jobCardContent}><div className={s.jobCardHeader}><div className={s.jobDetails}><h3 className={s.jobRole}>{job.roleName}</h3><p className={s.jobCompany}>{job.companyName}</p><p className={s.jobLocation}><MapPin className={s.jobLocationIcon} />{job.location}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Active</span></div><div className={s.jobMeta}><span className={s.jobCategory}>{job.category}</span><div className={s.jobApplicants}><Users className={s.jobApplicantsIcon} /><span className={s.jobApplicantsCount}>{job.applicationCount || 0}</span><span className={s.jobApplicantsLabel}>applicants</span></div></div><div className="flex items-center justify-between gap-3 pt-4"><button onClick={() => navigate("/employer/list/jobs")} className={s.viewApplicantsBtn}>Manage role</button><button onClick={() => handleCloseJob(job._id)} disabled={closingJobId === job._id} className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"><XCircle size={16} />{closingJobId === job._id ? "Closing..." : "Close role"}</button></div></div></div>)}</div> : <div className={s.emptyState}><Briefcase className={s.emptyStateIcon} /><p>No active roles yet.</p><button onClick={() => navigate("/employer/addjobs")} className={s.viewApplicantsBtn}>Create your first role</button></div>}</section>
    <section className={s.jobsSection}><div className={s.jobsHeader}><h2 className={s.jobsTitle}><Briefcase className={s.jobsTitleIcon} />Recent Postings</h2><div className={s.jobsFilterContainer}><select value={postingStatus} onChange={(e) => setPostingStatus(e.target.value)} className={s.jobsStatusSelect}><option value="active">Active Jobs</option><option value="closed">Closed Jobs</option></select><div className={s.jobsCount}>{filteredRecentJobs.length} {filteredRecentJobs.length === 1 ? "job" : "jobs"}</div></div></div>{filteredRecentJobs.length ? <div className={s.jobsGrid}>{filteredRecentJobs.slice(0, 6).map((job) => <div key={job._id} className={s.jobCard}><div className={s.jobCardOverlay}></div><div className={s.jobCardContent}><div className={s.jobCardHeader}><div className={s.jobDetails}><h3 className={s.jobRole}>{job.roleName}</h3><p className={s.jobCompany}>{job.companyName}</p><p className={s.jobLocation}><MapPin className={s.jobLocationIcon} />{job.location}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${job.status === "closed" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}>{job.status || "active"}</span></div><div className={s.jobMeta}><span className={s.jobCategory}>{job.category}</span><div className={s.jobApplicants}><Users className={s.jobApplicantsIcon} /><span className={s.jobApplicantsCount}>{job.applicationCount || 0}</span><span className={s.jobApplicantsLabel}>applicants</span></div></div><button onClick={() => navigate("/employer/list/jobs")} className={`${s.viewApplicantsBtn} mt-4`}>Manage role</button></div></div>)}</div> : <div className={s.emptyState}>No {postingStatus} postings.</div>}</section>
  </div></main>;
}
