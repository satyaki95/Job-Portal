import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";
import savedRouter from "./routes/saved.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";
import employerRouter from "./routes/employer.routes.js";
import adminRouter from "./routes/admin.routes.js";

const PORT = 5000;
const app = express();

// DB
connectDB();

// MIDDLEWARES
app.use(express.json());
app.use(cors());


app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);
app.use("/api/saved", savedRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/employer", employerRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
