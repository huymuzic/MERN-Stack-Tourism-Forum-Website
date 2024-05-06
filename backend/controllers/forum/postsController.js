import Post from "../../models/Post.js";

const categories = ['announce', 'discuss'];

export async function posts(req, res) {
    try {
        const queries = categories.map(category => 
            Post.find({ category: category }).limit(6).exec()
        );

        const results = await Promise.all(queries);
        const posts = categories.reduce((acc, category, index) => {
            acc[category] = results[index];
            return acc;
        }, {});

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}