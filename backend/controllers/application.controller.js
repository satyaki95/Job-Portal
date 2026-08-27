import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";

// USER TO APPLY FOR A JOB
export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id;


    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID is required" });
    }

    // check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // check if user's profile is complete or not
    const user = await User.findById(userId);

    if (!user || !user.phone || !user.resume) {
      return res.status(400).json({
        success: false,
        message:
          "Please complete your profile(add phone number and resume) before applying for a job",
      });
    }

    // check if user already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      user: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const newApplication = new Application({
      job: jobId,
      user: userId,
    });

    await newApplication.save();

    return res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL APPLICATIONS FOR A JOB(ADMIN)
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(400).json({ success: false, message: "Job not found" });
    }

    if (req.user.role === "employer" && job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You do not own this job" });
    }

    const applications = await Application.find({ job: jobId })
      .populate({
        path: "user",
        select: "name email phone role resume",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobName: job.roleName,
      applicants: applications
        .filter((app) => app.user)
        .map((app) => ({
          applicationId: app._id,
          ...app.user._doc,
          appliedDate: app.createdAt,
          status: app.status,
          resume: app.user.resume || "",
        })),
    });
  } catch (error) {
    console.error("Error fetching applications for job:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid application status" });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    if (req.user.role === "employer" && application.job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You do not own this job" });
    }

    application.status = status;
    await application.save();
    return res.status(200).json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL JOB APPLICATIONS FOR A USER
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ user: userId })
      .populate("job")
      .sort({ createdAt: -1 });

    const validApplications = applications.filter((app) => app.job !== null);

    return res.status(200).json({
      success: true,
      applications: validApplications,
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
