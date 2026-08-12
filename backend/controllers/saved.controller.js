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

// TOGGLE SAVE QUESTION
export const toggleSavedQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { type } = req.query;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let isSaved;
    let message;

    if (type === "role") {
      isSaved = user.savedRoleQuestions.includes(questionId);

      if (isSaved) {
        user.savedRoleQuestions = user.savedRoleQuestions.filter(
          (id) => id.toString() !== questionId,
        );
        message = "Role question unsaved";
      } else {
        user.savedRoleQuestions.push(questionId);
        message = "Role question saved";
      }
    } else {
      // default to interview question
      isSaved = user.saveInterviewQuestions.includes(questionId);

      if (isSaved) {
        user.saveInterviewQuestions = user.saveInterviewQuestions.filter(
          (id) => id.toString() !== questionId,
        );
        message = "Interview question unsaved";
      } else {
        user.saveInterviewQuestions.push(questionId);
        message = "Interview question saved";
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message,
      savedRoleQuestions: user.savedRoleQuestions,
      savedInterviewQuestions: user.saveInterviewQuestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating saved question status",
    });
  }
};

// TO GET ALL SAVED ITEMS
export const getSavedItems = async (req, res) => {
  try {
    const userId = req.user.id;
   

    const user = await User.findById(userId)
      .populate("savedJobs")
      .populate({
        path: "saveInterviewQuestions",
        populate: { path: "company" },
      })
      .populate({
        path: "savedRoleQuestions",
        populate: { path: "roleId" },
      });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      savedJobs: user.savedJobs,
      savedRoleQuestions: user.savedRoleQuestions,
      savedInterviewQuestions: user.saveInterviewQuestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving saved items",
    });
  }
};
