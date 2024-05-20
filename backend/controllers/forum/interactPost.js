import Post from "../../models/Post.js"
import uploadFiles from "../../utils/uploadImages.js";

async function findRootPostId(postId) {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  if (post.parentId === null) {
    return post._id;
  } else {
    return findRootPostId(post.parentId);
  }
}

export const deletePost = async (req, res) => {
  const id = req.params.id;
  try {
    const updPost = await Post.findByIdAndUpdate(
      id,
      {
        $set: { status: "deleted" },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully delete post",
      post: updPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete post. Try again",
    });
  }
};

export async function like(req, res) {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      req.user.likes = req.user.likes.filter((id) => !id.equals(postId));
      post.likes = post.likes.filter((id) => !id.equals(req.user._id));
    } else {
      req.user.likes.push(postId);
      post.likes.push(req.user._id);
    }

    await post.save();
    const updatedUser = await req.user.save();

    const rootPost = await findRootPostId(postId);
    const updPost = await Post.findById(rootPost).populate(['parentId', 'authorId', {
      path: 'childrenIds',
      populate: { path: 'authorId' }
    }]);

    res.status(200).json({ post: updPost, user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function reply(req, res) {
  uploadFiles(req, res, async (err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    }

    try {
      const postId = req.params.id;

      const post = await Post.findOne({ _id: postId });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const newReply = new Post({
        authorId: req.user._id,
        content: req.body.content,
        parentId: postId,
        images: req.files.map(file => file.id)
      });

      const reply = await newReply.save();

      req.user.posts.push(reply._id);

      const updatedUser = await req.user.save();

      post.childrenIds.push(reply._id);

      await post.save();
      const rootPost = await findRootPostId(postId);
      const updPost = await Post.findById(rootPost).populate(['parentId', 'authorId', {
        path: 'childrenIds',
        populate: { path: 'authorId' }
      }]);

      res.status(200).json({ post: updPost, user: updatedUser, repId: reply._id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}