import Post from "../../models/Post.js"

const categories = ['announce', 'discuss'];

export async function create(req, res) {
    try {
        const reqBody = req.body;

        if (!reqBody.title || !reqBody.category || !reqBody.content) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!categories.includes(reqBody.category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const newPost = new Post({
            title: req.body.title,
            category: req.body.category,
            content: req.body.content,
            authorId: req.user._id,
        });

        await newPost.save();

        req.user.posts.push(newPost._id);

        await req.user.save();
        
        res.status(200).json({
            message: 'Post created',
            postId: newPost._id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}