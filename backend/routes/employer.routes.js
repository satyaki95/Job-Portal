import express from "express";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import {
  closeEmployerJob,
  createEmployerJob,
  deleteEmployerJob,
  getEmployerApplicants,
  getEmployerDashboard,
  getEmployerJobs,
  getEmployerProfile,
  updateEmployerApplication,
  updateEmployerProfile,
  updateEmployerJob,
} from "../controllers/employer.controller.js";
import { upload } from "../middleware/uploadMiddleware.js";

const employerRouter = express.Router();
const employerOnly = [authMiddleware, authorize("employer")];

employerRouter.get("/dashboard", ...employerOnly, getEmployerDashboard);
employerRouter.post("/jobs", ...employerOnly, upload.single("companyLogo"), createEmployerJob);
employerRouter.get("/jobs", ...employerOnly, getEmployerJobs);
employerRouter.put("/jobs/:id", ...employerOnly, upload.single("companyLogo"), updateEmployerJob);
employerRouter.delete("/jobs/:id", ...employerOnly, deleteEmployerJob);
employerRouter.patch("/jobs/:id/close", ...employerOnly, closeEmployerJob);
employerRouter.get("/jobs/:jobId/applicants", ...employerOnly, getEmployerApplicants);
employerRouter.patch(
  "/applications/:applicationId/status",
  ...employerOnly,
  updateEmployerApplication,
);
employerRouter.get("/profile", ...employerOnly, getEmployerProfile);
employerRouter.put("/profile", ...employerOnly, updateEmployerProfile);

export default employerRouter;
