import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";

const publicUserFields = "-password -verificationOTP -verificationOTPExpires -resetPasswordOTP -resetPasswordOTPExpires";

export const getAdminOverview = async (req, res) => {
  try {
    const [users, employers, pendingEmployers, jobs, activeJobs, applications] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "employer" }),
      User.countDocuments({ role: "employer", employerStatus: "pending" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "active" }),
      Application.countDocuments(),
    ]);
    return res.json({
      success: true,
      stats: { users, employers, pendingEmployers, jobs, activeJobs, applications },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["user", "employer"] } })
      .select(publicUserFields)
      .sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmployerApproval = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid approval status" });
    }
    const employer = await User.findOneAndUpdate(
      { _id: req.params.userId, role: "employer" },
      { employerStatus: status },
      { new: true },
    ).select(publicUserFields);
    if (!employer) return res.status(404).json({ success: false, message: "Employer not found" });
    return res.json({ success: true, employer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.userId,
      role: { $in: ["user", "employer"] },
    });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "employer") await Job.deleteMany({ createdBy: user._id });
    return res.json({ success: true, message: "User removed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFraudulentJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    await Application.deleteMany({ job: job._id });
    return res.json({ success: true, message: "Job listing removed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
