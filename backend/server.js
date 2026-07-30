import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";

const PORT = 5000;
const app = express();

// DB
connectDB();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
