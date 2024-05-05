import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    avatar: {
      type: String,
      default: "default_avatar.png", // Replace with a valid default avatar URL or path
    },
    otp: String,  
    otpExpires: Date
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
