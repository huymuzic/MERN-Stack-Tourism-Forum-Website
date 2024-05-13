import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import forumRoute from "./routes/forum.js";
import postRoute from "./routes/post.js";
import formRoute from "./routes/form.js";
import tourRoute from "./routes/tour.js";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
};
const mongoURI = process.env.MONGO_URI;
// database connection
const connect = async () => {
  try {
    mongoose.connect(mongoURI);
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};
// middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/forum", forumRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/form", formRoute);
app.use("/api/v1/tours", tourRoute);

// testing
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
