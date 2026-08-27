import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getSavedItems,
  toggleSavedJob,
} from "../controllers/saved.controller.js";

const savedRouter = express.Router();

savedRouter.use(authMiddleware);

savedRouter.get("/", getSavedItems);
savedRouter.post("/job/:jobId", toggleSavedJob);

export default savedRouter;
