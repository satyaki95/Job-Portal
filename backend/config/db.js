import mongoose from "mongoose";

export const connectDB = async (req, res) => {
  await mongoose
    .connect(
      `${process.env.MONGODB_URI}/Job`,
    )
    .then(() => {
      console.log("DB CONNECTED");
    });
};
