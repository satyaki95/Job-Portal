import { useEffect, useState } from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("jobportal_user") || "null");
    if (!user?.token) {
      setLoading(false);
      return;
    }
    fetch(`${baseURL}/api/application/user`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message);
        setApplications(data.applications || []);
      })
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-emerald-600">
          Apprentice workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          My Applications
        </h1>
        <p className="mt-2 text-slate-500">
          Track every apprenticeship and trade-job application in one place.
        </p>
        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {loading ? (
            <p className="p-8 text-center text-slate-500">
              Loading applications...
            </p>
          ) : applications.length === 0 ? (
            <p className="p-12 text-center text-slate-500">
              You have not applied for any jobs yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((application) => {
                const job = application.job;
                const status = application.status || "pending";
                return (
                  <article
                    key={application._id}
                    className="flex flex-wrap items-center justify-between gap-4 p-6"
                  >
                    <div>
                      <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                        <Briefcase size={18} className="text-emerald-600" />
                        {job?.roleName || "Job unavailable"}
                      </h2>
                      <p className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span>{job?.companyName || "Workshop or factory"}</span>
                        {job?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Applied{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${status === "accepted" ? "bg-emerald-50 text-emerald-700" : status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}
                    >
                      {status === "accepted" ? "Shortlisted" : status}
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
