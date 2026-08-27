import express from "express";
import {
  closeJob,
  createJob,
  deleteJob,
  getAllJobs,
  getDashboardStats,
  getJobById,
  getJobsByAdmin,
  updateJob,
} from "../controllers/job.controller.js";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const jobRouter = express.Router();

jobRouter.post(
  "/",
  authMiddleware,
  authorize("admin", "employer"),
  upload.single("companyLogo"),
  createJob,
);

jobRouter.get(
  "/admin/stats",
  authMiddleware,
  authorize("admin", "employer"),
  getDashboardStats,
);

jobRouter.get(
  "/admin/jobs",
  authMiddleware,
  authorize("admin", "employer"),
  getJobsByAdmin,
);

jobRouter.get("/", getAllJobs);
jobRouter.get("/:id", getJobById);

jobRouter.put(
  "/:id",
  authMiddleware,
  authorize("admin", "employer"),
  upload.single("companyLogo"),
  updateJob,
);

jobRouter.delete("/:id", authMiddleware, authorize("admin", "employer"), deleteJob);
jobRouter.patch("/:id/close", authMiddleware, authorize("admin", "employer"), closeJob);

export default jobRouter;
