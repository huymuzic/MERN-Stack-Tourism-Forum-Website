import React, { useState } from "react";
import { usePosts } from "../../../utils/PostsContext";
import { useUserInfo } from "../../../utils/UserInforContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PostCard.css";

function PostCard({ post }) {
    const { updatePost, deletePost, toggleLike } = usePosts();
    const { user } = useUserInfo();
    const [editMode, setEditMode] = useState(false);
    const [editableContent, setEditableContent] = useState(post.content);
    const [editableImage, setEditableImage] = useState(post.image);

    const isLiked = post.likes.includes(user._id);

    const handleSave = () => {
        updatePost(post._id, { content: editableContent, image: editableImage });
        setEditMode(false);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleDelete = () => {
        deletePost(post._id);
    };

    const handleLike = () => {
        toggleLike(post._id, user._id);
    };

    return (
        <div className="card post-card">
            <div className="card-body">
                <h5 className="card-title">{post.authorId.username}</h5>
                <p className="card-text">{new Date(post.createdAt).toLocaleString()}</p>
                {editMode ? (
                    <>
                        <input className="form-control" type="text" value={editableContent} onChange={(e) => setEditableContent(e.target.value)} />
                        <input className="form-control mt-2" type="text" value={editableImage} onChange={(e) => setEditableImage(e.target.value)} />
                        <button className="btn btn-primary mt-2" onClick={handleSave}>Save</button>
                    </>
                ) : (
                    <>
                        <p>{post.content}</p>
                        {post.image && <img src={post.image} alt="Post content" className="img-fluid rounded mt-3" />}
                        <p className="mt-2"><strong>Likes:</strong> {post.likes.length}</p>
                    </>
                )}
                <button className={`btn ${isLiked ? "btn-danger" : "btn-outline-danger"} mr-2`} onClick={handleLike}>
                    <i className="fa fa-heart"></i> Like
                </button>
                <button className="btn btn-info mr-2" onClick={handleEdit}>Edit</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}

export default PostCard;
