import Post from "../../models/Post.js"

const categories = ['announce', 'discuss'];

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
    try {
        const postId = req.params.id;

        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        req.user.posts.push(postId);

        const updatedUser = await req.user.save();

        const newReply = new Post({
            authorId: req.user._id,
            content: req.body.content,
            parentId: postId,
        });

        const reply = await newReply.save();

        post.childrenIds.push(reply._id);

        await post.save();
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