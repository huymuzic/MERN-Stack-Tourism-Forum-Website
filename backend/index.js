import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// database connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB is connected");
  } catch (err) {
    console.error("MongoDB database connection failed", err.message);
  }
};

// middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

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
