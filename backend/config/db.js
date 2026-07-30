import mongoose from "mongoose";

export const connectDB = async (req, res) => {
  await mongoose
    .connect(
      "mongodb+srv://wwwsatyaki95_db_user:R7QBx6hJXyUsDPJj@cluster1.iytfrpd.mongodb.net/Job",
    )
    .then(() => {
      console.log("DB CONNECTED");
    });
};
