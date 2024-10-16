import Post from "../models/Post.js";
import User from "../models/user.js";

// Fetch all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("authorId", "username email")
      .exec();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res
      .status(500)
      .json({
        message: "Server error while fetching posts",
        error: err.message,
      });
  }
};

// Fetch posts for a specific user
export const getPostsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const postIds = user.posts;
    const posts = await Post.find({
      authorId: userId,
      _id: { $in: user.posts },
      status: { $in: ["archived", "unarchived"] },
    })
      .populate("authorId", "username email")
      .exec();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res
      .status(500)
      .json({
        message: "Server error while fetching user posts",
        error: err.message,
      });
  }
};

// Fetch favorite posts for a specific user
export const getFavoritePostsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const FavorpostIds = user.likes;
    const posts = await Post.find({
      _id: { $in: FavorpostIds },
      parentId: null,
      status: { $in: ["archived", "unarchived"] },
    })
      .populate("authorId", "username email")
      .exec();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching favorite posts:", err);
    res
      .status(500)
      .json({
        message: "Server error while fetching favorite posts",
        error: err.message,
      });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({ ...req.body, authorId: userId });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(400).json({ message: err.message });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: err.message });
  }
};

// Toggle like/favorite on a post
export const toggleLikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure that both likes arrays are initialized
    if (!post.likes) post.likes = [];
    if (!user.likes) user.likes = [];

    // Toggle like on the post
    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
      if (!user.likes.includes(postId)) {
        user.likes.push(postId); // Add postId to user's likes
      }
    } else {
      post.likes.splice(likeIndex, 1);
      const userLikeIndex = user.likes.indexOf(postId);
      if (userLikeIndex !== -1) {
        user.likes.splice(userLikeIndex, 1); // Remove postId from user's likes
      }
    }

    // Save both the updated post and user
    await post.save();
    await user.save();
    // Fetch favorite posts by user
    const favorPostIds = user.likes;
    const favoritePosts = await Post.find({
      _id: { $in: favorPostIds },
      parentId: null,
    })
      .populate("authorId", "username email")
      .exec();

    res.json({ post, favoritePosts, favorPostIds });
  } catch (err) {
    console.error("Error toggling like on post:", err);
    res.status(500).json({ message: err.message });
  }
};

// get List Posts
export const getListPosts = async (req, res) => {
  try {
    let { page, limit, status, searchType, search } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      if (searchType === "author") {
        const userFilter = {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        };
        const users = await User.find(userFilter);
        const userIds = users.map((user) => user._id);
        filter.authorId = { $in: userIds };
      } else if (searchType === "content") {
        const regex = new RegExp(search, "i");
        filter.$or = [{ title: regex }, { content: regex }];
      } else {
        const regex = new RegExp(search, "i");
        filter.$or = [{ title: regex }, { content: regex }];
      }
    }
    const totalCount = await Post.countDocuments();
    const totalPages = (await Post.countDocuments(filter)) / limit;
    const posts = await Post.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate("authorId", "username email")
      .exec();

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(totalPages),
      totalCount: totalCount,
      message: "Successfully fetched posts",
      data: posts,
    });
  } catch (err) {
    console.error("Error fetching list of posts:", err);
    res
      .status(500)
      .json({
        message: "Server error while fetching list of posts",
        error: err.message,
      });
  }
};

// Lock post
export const hidePost = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await Post.findByIdAndUpdate(
      id,
      {
        $set: { status: "archived" },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully hide post",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to hide post. Try again",
    });
  }
};

// Unlock user
export const unhidePost = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await Post.findByIdAndUpdate(
      id,
      {
        $set: { status: "unarchived" },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully unhide post",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to unhide post. Try again",
    });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await Post.findByIdAndUpdate(
      id,
      {
        $set: { status: "deleted" },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully delete post",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete post. Try again",
    });
  }
};
