import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    default: null,
  },
  content: {
    type: String,
    required: true,
  },
  childrenIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post",
    default: [],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  status: {
    type: String,
    enum: ["archived", "deleted", 'unarchived'],
    default: 'unarchived',
  },
  images: {
    type: [mongoose.Schema.Types.ObjectId],
  },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;
