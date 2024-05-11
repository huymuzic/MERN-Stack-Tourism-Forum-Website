import Post from "../../models/Post.js"

export async function searchFilter(req, res) {
    const { title, keyword, category } = req.query;
    let filter = { parentId: null };

    if (title) {
        filter.title = { $regex: `^${title}$`, $options: 'i' };
    }

    if (keyword) {
        filter.content = { $regex: `^${keyword}$`, $options: 'i' };
    }

    if (category) {
        filter.category = category;
    }

    try {
        const posts = await Post.find(filter)
            .populate(['authorId', 'childrenIds'])
            .skip(Number(req.headers.skip) || 0)
            .limit(5);

        const length = await Post.countDocuments(filter);

        res.json({posts: posts, length: length});
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}