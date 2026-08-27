import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    tradeSkills: {
      type: [String],
      default: [],
    },
    certificationDetails: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "employer", "admin"],
      default: "user",
    },
    employerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    resume: {
      type: String,
      default: "",
    },
    resumePublicId: {
      type: String,
      default: "",
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOTP: String,
    verificationOTPExpires: Date,
    resetPasswordOTP: String,
    resetPasswordOTPExpires: Date,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
