import express from "express";
import { submitInquiry } from "../controllers/inquiry.controller.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/", submitInquiry);

export default inquiryRouter;
