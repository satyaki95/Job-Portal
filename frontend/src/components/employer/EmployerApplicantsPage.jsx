import { useEffect, useState } from "react";
import { Mail, Users, ExternalLink, Briefcase, Building2 } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;
const getToken = () =>
  localStorage.getItem("token") ||
  JSON.parse(localStorage.getItem("jobportal_user") || "null")?.token;

export default function EmployerApplicantsPage() {
  const { state } = useLocation();
  const { jobId: routeJobId } = useParams();
  const jobId = routeJobId || state?.jobId;
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(
      jobId
        ? `${baseURL}/api/employer/jobs/${jobId}/applicants`
        : `${baseURL}/api/employer/applicants`,
      {
      headers: { Authorization: `Bearer ${getToken()}` },
      },
    )
      .then((res) => res.json())
      .then((data) => setApplicants(data.applicants || []))
      .catch(() => setApplicants([]))
      .finally(() => setLoading(false));
  }, [jobId]);
  const updateStatus = async (applicationId, status) => {
    const res = await fetch(
      `${baseURL}/api/employer/applications/${applicationId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      },
    );
    if (res.ok)
      setApplicants((current) =>
        current.map((app) =>
          app.applicationId === applicationId ? { ...app, status } : app,
        ),
      );
  };
  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-emerald-600">
          Hiring pipeline
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {state?.role || (jobId ? "Applicants" : "All Applicants")}
        </h1>
        <p className="mt-2 text-slate-500">
          {state?.companyName ||
            "Review candidates and shortlist the strongest matches."}
        </p>
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
          {loading ? (
            <p className="py-10 text-center text-slate-500">
              Loading applicants...
            </p>
          ) : !applicants.length ? (
            <div className="py-12 text-center text-slate-500">
              <Users className="mx-auto mb-3 text-slate-300" size={34} />
              No applications yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {applicants.map((app) => (
                <article
                  key={app.applicationId}
                  className="rounded-lg border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {app.name}
                      </h2>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <Mail size={14} />
                        {app.email}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Briefcase size={14} />
                        {app.appliedForRole || state?.role || "Job"}
                      </p>
                      {(app.companyName || state?.companyName) && (
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <Building2 size={14} />
                          {app.companyName || state.companyName}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                      {app.status || "pending"}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {app.resume && (
                      <a
                        href={`${baseURL}/api/user/resume/${app._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                      >
                        <ExternalLink size={14} />
                        Resume
                      </a>
                    )}
                    {app.status !== "accepted" && (
                      <button
                        onClick={() =>
                          updateStatus(app.applicationId, "accepted")
                        }
                        className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Shortlist
                      </button>
                    )}
                    <button
                      onClick={() =>
                        updateStatus(app.applicationId, "rejected")
                      }
                      className="rounded-md border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600"
                    >
                      Reject
                    </button>
                    <a
                      href={`mailto:${app.email}`}
                      className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      Contact
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
