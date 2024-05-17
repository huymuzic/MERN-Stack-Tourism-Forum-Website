import Post from "../../models/Post.js"
import uploadFiles from "../../utils/uploadImages.js";

export const create = async (req, res) => {
    uploadFiles(req, res, async (err) => {
        if (err) {
            res.status(500).json({ message: err.message });
        }

        try {
            const reqBody = req.body;

            if (!reqBody.title || !reqBody.content) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const newPost = new Post({
                title: reqBody.title,
                content: reqBody.content,
                authorId: req.user._id,
                images: req.files.map(file => file.id)
            });

            await newPost.save();

            req.user.posts.push(newPost._id);

            await req.user.save();

            res.status(200).json({
                message: 'Post created',
                postId: newPost._id,
            });
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ message: error.message });
        }
    });

};