import Post from "../../models/Post.js"

async function cursivePopulate(post) {
    if (post.parentId !== null) {
        const popedPost = await post.populate(['authorId', {
            path: 'childrenIds',
            populate: [{ path: 'authorId' }, { path: 'parentId' , populate: { path: 'authorId' } }]
        }, {
            path: 'parentId',
            populate: [{ path: 'authorId' }, { path: 'parentId' , populate: { path: 'authorId' } }]
        }]);
        return cursivePopulate(popedPost.parentId);
    }

    return await post.populate(['authorId', {
        path: 'childrenIds',
        populate: [{ path: 'authorId' }, { path: 'parentId'}]
    }]);
}

export async function details(req, res) {
    try {
        const id = req.params.id;

        const post = await Post.findOne({ _id: id, status: 'unarchived' }).populate(['parentId', 'authorId', {
            path: 'childrenIds',
            populate: [{ path: 'authorId' }, { path: 'parentId', populate: { path: 'authorId' } }],
            options: { sort: { 'updatedAt': -1 } }
        }]);

        const rootPost = post.parentId === null ? post : await cursivePopulate(post);

        res.json({ root: rootPost, post: post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}