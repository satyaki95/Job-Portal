import User from "../models/user.model.js";

// TOGGLE SAVED JOB
export const toggleSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isSaved ? "Job unsaved" : "Job saved",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating saved job status" });
  }
};

// TO GET ALL SAVED ITEMS
export const getSavedItems = async (req, res) => {
  try {
    const userId = req.user.id;
   

    const user = await User.findById(userId).populate("savedJobs");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving saved items",
    });
  }
};
