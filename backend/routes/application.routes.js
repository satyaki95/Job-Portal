import express from "express";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import {
  applyJob,
  getApplicants,
  getUserApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";

const applicationRouter = express.Router();

applicationRouter.post("/apply/:jobId", authMiddleware, applyJob);

applicationRouter.get("/user", authMiddleware, getUserApplications);

applicationRouter.get(
  "/:id/applicants",
  authMiddleware,
  authorize("admin", "employer"),
  getApplicants,
);

applicationRouter.patch(
  "/:id/status",
  authMiddleware,
  authorize("admin", "employer"),
  updateApplicationStatus,
);

export default applicationRouter;
