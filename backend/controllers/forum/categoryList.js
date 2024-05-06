import Post from "../../models/Post.js"

const categories = ['announce', 'discuss'];

export async function category(req, res) {
    try {
        const category = req.params.category;

        if (!categories.includes(category)) {
            throw new Error('Invalid category');
        }

        const posts = await Post.find({ category: category }).populate(['authorId', 'childrenIds'])

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}