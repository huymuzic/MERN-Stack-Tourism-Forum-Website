import Post from "../../models/Post.js";

export async function posts(req, res) {
    try {
        const posts = await Post.find({ parentId: null })
            .populate(['authorId', 'childrenIds'])
            .sort({ 'updatedAt': -1 })
            .skip(Number(req.headers.skip) || 0)
            .limit(5);
        
        const length = await Post.countDocuments({ parentId: null });

        res.json({posts: posts, length: length});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}