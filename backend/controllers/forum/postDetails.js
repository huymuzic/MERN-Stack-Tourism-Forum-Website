import Post from "../../models/Post.js"

async function cursivePopulate(post) {
    if (post.parentId !== null) {
        await post.populate(['parentId', 'authorId', {
            path: 'childrenIds',
            populate: [{ path: 'authorId' }, { path: 'parentId'}]
        }]);
        return cursivePopulate(post.parentId); 
    }

    return await post.populate(['authorId', {
        path: 'childrenIds',
        populate: [{ path: 'authorId' }, { path: 'parentId'}]
    }]);
}

export async function details(req, res) {
    try {
        const id = req.params.id;

        const post = await Post.findOne({ _id: id }).populate(['parentId', 'authorId', {
            path: 'childrenIds',
            populate: [{ path: 'authorId' }, { path: 'parentId'}],
            options: { sort: { 'updatedAt': -1 } }
        }]);

        const rootPost = post.parentId === null ? post : await cursivePopulate(post);

        res.json({ root: rootPost, post: post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}