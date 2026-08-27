import { useEffect, useState } from "react";
import { Check, ShieldAlert, Trash2, Users, X } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("jobportal_user") || "null");
  return localStorage.getItem("token") || user?.token;
};

export default function AdminManagementPage() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${getToken()}` };
    try {
      const [overviewResponse, usersResponse, jobsResponse] = await Promise.all([
        fetch(`${baseURL}/api/admin/overview`, { headers }),
        fetch(`${baseURL}/api/admin/users`, { headers }),
        fetch(`${baseURL}/api/job/admin/jobs`, { headers }),
      ]);
      const [overview, userData, jobData] = await Promise.all([
        overviewResponse.json(),
        usersResponse.json(),
        jobsResponse.json(),
      ]);
      if (overview.success) setStats(overview.stats);
      if (userData.success) setUsers(userData.users || []);
      if (jobData.success) setJobs(jobData.jobs || []);
    } catch {
      setMessage("Unable to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(loadData, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const updateEmployer = async (userId, status) => {
    const response = await fetch(`${baseURL}/api/admin/employers/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      setUsers((current) => current.map((user) => user._id === userId ? { ...user, employerStatus: status } : user));
      const overviewResponse = await fetch(`${baseURL}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const overview = await overviewResponse.json();
      if (overview.success) setStats(overview.stats);
    }
  };

  const removeUser = async (userId) => {
    if (!window.confirm("Remove this user and their employer jobs?")) return;
    const response = await fetch(`${baseURL}/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (response.ok) setUsers((current) => current.filter((user) => user._id !== userId));
  };

  const removeJob = async (jobId) => {
    if (!window.confirm("Remove this fraudulent job listing?")) return;
    const response = await fetch(`${baseURL}/api/admin/jobs/${jobId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (response.ok) setJobs((current) => current.filter((job) => job._id !== jobId));
  };

  const cards = [
    ["Job seekers", stats.users, "text-sky-700"],
    ["Employers", stats.employers, "text-emerald-700"],
    ["Pending approvals", stats.pendingEmployers, "text-amber-700"],
    ["Active listings", stats.activeJobs, "text-indigo-700"],
    ["Applications", stats.applications, "text-violet-700"],
  ];

  return <main className="min-h-screen bg-slate-50 px-5 py-10"><div className="mx-auto max-w-7xl">
    <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[.18em] text-indigo-600">Administration</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Users, employers, and trust</h1><p className="mt-2 text-slate-500">Approve legitimate employers, monitor platform activity, and remove suspicious listings.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{cards.map(([label, value, color]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5"><p className={`text-sm font-semibold ${color}`}>{label}</p><strong className="mt-2 block text-3xl text-slate-900">{value ?? 0}</strong></div>)}</div>
    {message && <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</p>}
    <div className="mt-8 grid gap-8 lg:grid-cols-2"><section className="rounded-xl border border-slate-200 bg-white"><div className="flex items-center gap-2 border-b border-slate-100 px-6 py-5"><Users size={19} className="text-indigo-600" /><h2 className="font-semibold text-slate-900">Users and employers</h2></div>{loading ? <p className="p-6 text-slate-500">Loading...</p> : <div className="divide-y divide-slate-100">{users.map((user) => <div key={user._id} className="flex items-center justify-between gap-3 px-6 py-4"><div className="min-w-0"><p className="truncate font-semibold text-slate-900">{user.name}</p><p className="truncate text-sm text-slate-500">{user.email} · {user.role}</p></div><div className="flex shrink-0 items-center gap-2">{user.role === "employer" && <><span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-600">{user.employerStatus}</span>{user.employerStatus !== "approved" && <button title="Approve employer" onClick={() => updateEmployer(user._id, "approved")} className="rounded-md bg-emerald-600 p-2 text-white"><Check size={15} /></button>}{user.employerStatus !== "rejected" && <button title="Reject employer" onClick={() => updateEmployer(user._id, "rejected")} className="rounded-md border border-amber-200 p-2 text-amber-700"><X size={15} /></button>}</>}<button title="Remove user" onClick={() => removeUser(user._id)} className="rounded-md border border-rose-200 p-2 text-rose-600"><Trash2 size={15} /></button></div></div>)}</div>}</section>
    <section className="rounded-xl border border-slate-200 bg-white"><div className="flex items-center gap-2 border-b border-slate-100 px-6 py-5"><ShieldAlert size={19} className="text-rose-600" /><h2 className="font-semibold text-slate-900">Job listing moderation</h2></div>{loading ? <p className="p-6 text-slate-500">Loading...</p> : <div className="divide-y divide-slate-100">{jobs.map((job) => <div key={job._id} className="flex items-center justify-between gap-3 px-6 py-4"><div className="min-w-0"><p className="truncate font-semibold text-slate-900">{job.roleName}</p><p className="truncate text-sm text-slate-500">{job.companyName} · {job.location}</p></div><button title="Remove fraudulent listing" onClick={() => removeJob(job._id)} className="rounded-md border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={15} /></button></div>)}{!jobs.length && <p className="p-6 text-slate-500">No job listings found.</p>}</div>}</section></div>
  </div></main>;
}
