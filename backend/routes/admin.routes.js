import express from "express";
import { authMiddleware, authorize } from "../middleware/authMiddleware.js";
import {
  deleteAdminUser,
  getAdminOverview,
  getAdminUsers,
  removeFraudulentJob,
  updateEmployerApproval,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();
adminRouter.use(authMiddleware, authorize("admin"));

adminRouter.get("/overview", getAdminOverview);
adminRouter.get("/users", getAdminUsers);
adminRouter.patch("/employers/:userId/status", updateEmployerApproval);
adminRouter.delete("/users/:userId", deleteAdminUser);
adminRouter.delete("/jobs/:jobId", removeFraudulentJob);

export default adminRouter;
