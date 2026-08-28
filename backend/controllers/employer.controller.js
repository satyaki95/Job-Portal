import Application from "../models/application.model.js";
import Employer from "../models/employer.model.js";
import Job from "../models/job.model.js";
import { closeJob, createJob, deleteJob, updateJob } from "./job.controller.js";

const ownerQuery = (userId) => ({ createdBy: userId });

export const createEmployerJob = createJob;
export const updateEmployerJob = updateJob;
export const deleteEmployerJob = deleteJob;
export const closeEmployerJob = closeJob;

export const getEmployerDashboard = async (req, res) => {
  try {
    const jobs = await Job.find(ownerQuery(req.user.id)).sort({ createdAt: -1 });
    const jobIds = jobs.map((job) => job._id);
    const [closedJobs, totalApplications] = await Promise.all([
      Job.countDocuments({ ...ownerQuery(req.user.id), status: "closed" }),
      Application.countDocuments({ job: { $in: jobIds } }),
    ]);
    const applicationStats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$job", count: { $sum: 1 } } },
    ]);
    const applicationCountMap = applicationStats.reduce((counts, stat) => {
      counts[stat._id.toString()] = stat.count;
      return counts;
    }, {});
    const jobsWithStats = jobs.slice(0, 10).map((job) => ({
      ...job.toObject(),
      applicationCount: applicationCountMap[job._id.toString()] || 0,
    }));

    return res.json({
      success: true,
      stats: { totalJobs: jobs.length, closedJobs, totalApplications },
      jobs: jobsWithStats,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find(ownerQuery(req.user.id)).sort({ createdAt: -1 });
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => ({
        ...job.toObject(),
        applicationCount: await Application.countDocuments({ job: job._id }),
      })),
    );
    return res.json({ success: true, jobs: jobsWithStats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployerApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      ...ownerQuery(req.user.id),
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const applications = await Application.find({ job: job._id })
      .populate("user", "name email phone resume")
      .sort({ createdAt: -1 });
    return res.json({
      success: true,
      jobName: job.roleName,
      applicants: applications
        .filter((application) => application.user)
        .map((application) => ({
          applicationId: application._id,
          ...application.user.toObject(),
          appliedDate: application.createdAt,
          status: application.status,
        })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEmployerApplicants = async (req, res) => {
  try {
    const jobs = await Job.find(ownerQuery(req.user.id)).select("_id roleName companyName");
    const jobDetails = jobs.reduce((details, job) => {
      details[job._id.toString()] = {
        roleName: job.roleName,
        companyName: job.companyName,
      };
      return details;
    }, {});
    const applications = await Application.find({ job: { $in: jobs.map((job) => job._id) } })
      .populate("user", "name email phone resume")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      applicants: applications
        .filter((application) => application.user)
        .map((application) => ({
          applicationId: application._id,
          ...application.user.toObject(),
          appliedForRole: jobDetails[application.job.toString()]?.roleName || "Applicants",
          companyName: jobDetails[application.job.toString()]?.companyName || "",
          appliedDate: application.createdAt,
          status: application.status,
        })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmployerApplication = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid application status" });
    }
    const application = await Application.findById(req.params.applicationId).populate("job");
    if (!application || application.job.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    application.status = status;
    await application.save();
    return res.json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployerProfile = async (req, res) => {
  const profile = await Employer.findOne({ user: req.user.id }).populate("user", "name email phone");
  return res.json({ success: true, profile });
};

export const updateEmployerProfile = async (req, res) => {
  try {
    const { organizationName, website, description, logo } = req.body;
    if (!organizationName?.trim()) {
      return res.status(400).json({ success: false, message: "Organization name is required" });
    }
    const profile = await Employer.findOneAndUpdate(
      { user: req.user.id },
      { user: req.user.id, organizationName, website, description, logo },
      { new: true, upsert: true, runValidators: true },
    );
    return res.json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

