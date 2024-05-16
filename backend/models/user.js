import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    posts: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive","locked"],
      default: "active",
      required: true,
    },
    theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
      default: null,
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
