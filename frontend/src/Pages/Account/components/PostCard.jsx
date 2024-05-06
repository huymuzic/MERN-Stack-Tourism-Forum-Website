import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PostCard.css";
import { useUserInfo } from "../../../utils/UserInforContext";

function PostCard({ post, onToggleLike }) {
    const [editMode, setEditMode] = useState(false);
    const [editableContent, setEditableContent] = useState(post.content);
    const [editableImage, setEditableImage] = useState(post.image);
    const { info } = useUserInfo();
    const [isLiked, setIsLiked] = useState(info.likes.includes(post._id));
    const [showOptions, setShowOptions] = useState(false);

    const handleSave = () => {
        setEditMode(false);
    };

    const handleEdit = () => {
        setEditMode(true);
        setShowOptions(false);
    };

    const handleLike = () => {
        onToggleLike(post._id);
        setIsLiked(!isLiked);
    };
    const handleDelete = () => {
        deletePost(post.id);
    };

    const handleHide = () => {
        hidePost(post.id, { locked: !post.locked } ); }

    const handleClickOutside = (event) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };

    useEffect(() => {
        const handleMouseDown = (event) => handleClickOutside(event);
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, []);

    return (
        <div className="card post-card">
            <div className="card-body">
                <h5 className="card-title"><b>{post.title}</b></h5>
                <p className="card-text">@{post.authorId.username}</p>
                <p className="card-text">{new Date(post.createdAt).toLocaleString()}</p>
                {post.author === info.id && (
                    <div className="edit-container">
                        <img src="src/assets/images/EditButton.png" alt="Edit Button" className="edit-button" onClick={toggleOptions}/>
                    </div>
                )}
                {showOptions && (
                    <div ref={optionsRef} className="options-bar">
                        {!editMode && <button className="btn btn-secondary" onClick={handleEdit}>Edit Post</button>}
                        <button className="btn btn-danger" onClick={handleDelete}>Delete Post</button>
                        <button className="btn btn-warning" onClick={handleHide}>{post.locked ? "Hide Post" : "Unhide Post"}</button>
                    </div>
                )}
                {editMode ? (
                    <>
                        <input
                            className="form-control"
                            type="text"
                            value={editableContent}
                            onChange={(e) => setEditableContent(e.target.value)}
                        />
                        <input
                            className="form-control mt-2"
                            type="text"
                            value={editableImage}
                            onChange={(e) => setEditableImage(e.target.value)}
                        />
                        <button className="btn btn-primary mt-2" onClick={handleSave}>
                            Save
                        </button>
                    </>
                ) : (
                    <>
                         <ReactMarkdown>{post.content}</ReactMarkdown>
                        {post.image && <img src={post.image} alt="Post content" className="img-fluid rounded mt-3" />}
                        <p className="mt-2">
                            <strong>Likes:</strong> {post.likes.length}
                        </p>
                    </>
                )}
                <button
                    className={`btn ${isLiked ? "btn-pink" : "btn-outline-pink"} mr-2 favorite-button`}
                    onClick={handleLike}
                >
                    <i className={`fa ${isLiked ? "fa-heart" : "fa-heart-o"}`}></i> {isLiked ? "Liked" : "Like"}
                </button>
            </div>
        </div>
    );
}

export default PostCard;







