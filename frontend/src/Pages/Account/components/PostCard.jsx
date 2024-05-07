import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PostCard.css";
import { useUserInfo } from "../../../utils/UserInforContext";
import { SlShare } from "react-icons/sl";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PostCard({ post, onToggleLike }) {
    const [editMode, setEditMode] = useState(false);
    const [editableContent, setEditableContent] = useState(post.content);
    const [editableImage, setEditableImage] = useState(post.image);
    const { info } = useUserInfo();
    const [isLiked, setIsLiked] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const navigate = useNavigate();

    const handleSave = () => {
        setEditMode(false);
    };

    useEffect(() => {
        // Initialize `isLiked` state only if `info` is available
        if (info && info.likes) {
            setIsLiked(info.likes.includes(post._id));
        }
    }, [info, post._id]);

    const handleEdit = () => {
        setEditMode(true);
        setShowOptions(false);
    };

    const handleLike = () => {
        onToggleLike(post._id);
        setIsLiked(!isLiked);
    };

    const handleDelete = () => {
        // Replace `deletePost` with your actual delete function
        console.log("Delete Post:", post.id);
    };

    const handleHide = () => {
        // Replace `hidePost` with your actual hide function
        console.log("Hide Post:", post.id);
    };

    const toggleOptions = (event) => {
        event.stopPropagation();
        setShowOptions((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };

    const handleCommentsClick = () => {
        navigate(`/forum/p/${post._id}`);
    };

    useEffect(() => {
        const handleMouseDown = (event) => handleClickOutside(event);
        document.addEventListener("mousedown", handleMouseDown);
        return () => document.removeEventListener("mousedown", handleMouseDown);
    }, []);

    return (
        <div className="card post-card">
            <div className="card-body">
                <h5 className="card-title"><b>{post.title}</b></h5>
                <p className="card-text">@{post.authorId.username}</p>
                <p className="card-text">{new Date(post.createdAt).toLocaleString()}</p>
                {post.authorId === info.id && (
                    <div className="edit-container">
                        <SlShare alt="Edit Button" className="edit-button" onClick={toggleOptions} />
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
                        <p><b>Liked:</b> {post?.likes.length}   <b>Comments:</b> {post.childrenIds.length}</p>
                        <div className="like-comment-row mt-2">
                            <button
                                className={`btn ${isLiked ? "btn-pink" : "btn-outline-pink"} favorite-button mr-2`}
                                onClick={handleLike}
                            >
                                 {isLiked ? <FaHeart /> : <FaRegHeart />} {isLiked ? "Liked" : "Like"}
                            </button>
                            <button
                                className="btn comment-button"
                                onClick={handleCommentsClick}
                            >
                                <FaComment />{post.childrenIds.length}  Comments
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PostCard;




