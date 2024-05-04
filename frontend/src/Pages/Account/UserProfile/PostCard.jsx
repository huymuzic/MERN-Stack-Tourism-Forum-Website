import React, { useState, useEffect, useRef } from 'react';
import { useUser } from './Data/UserData.jsx';
import { usePosts } from './Data/PostData.jsx';
import { useFavorite } from './Data/PostFavortieData.jsx'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/PostCard.css';

function PostCard({ post }) {
    const { updatePost, deletePost, hidePost } = usePosts();
    const { favorites, addFavorite, removeFavorite } = useFavorite();
    const [showOptions, setShowOptions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editableContent, setEditableContent] = useState(post.content);
    const [editableImage, setEditableImage] = useState(post.image);
    const [showSuccess, setShowSuccess] = useState(false);
    const optionsRef = useRef(null);
    const { user } = useUser();

    const isFavorite = favorites.some(fav => fav.Post_id === post.id && fav.userId === user.id);

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFavorite(post.id);
            updatePost(post.id, { favorites: post.favorites - 1 });
        } else {
            addFavorite({ Post_id: post.id, userId: user.id });
            updatePost(post.id, { favorites: post.favorites + 1 });
        }
    };

    const toggleOptions = (event) => {
        event.stopPropagation();
        setShowOptions(prev => !prev);
    };

    const handleSave = () => {
        updatePost(post.id, { content: editableContent, image: editableImage });
        setEditMode(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleEdit = () => {
        setEditMode(true);
        setShowOptions(false);
    };

    const handleDelete = () => {
        deletePost(post.id);
    };

    const handleHide = () => {
        hidePost(post.id, { active: !post.active });
    };

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
                <h3 className="card-title">{post.userName}</h3>
                <p className="card-text">{post.postDate}</p>
                {editMode ? (
                    <>
                        <input className="form-control" type="text" value={editableContent} onChange={(e) => setEditableContent(e.target.value)} />
                        <input className="form-control mt-2" type="text" value={editableImage} onChange={(e) => setEditableImage(e.target.value)} />
                        <button className="btn btn-primary mt-2" onClick={handleSave}>Save</button>
                    </>
                ) : (
                    <>
                        <p>{post.content}</p>
                        <img src={post.image} alt="Post content" className="img-fluid rounded mt-3" />
                        <p className="mt-2"><strong>Favorites:</strong> {post.favorites} <strong>Comments:</strong> {post.comments}</p>
                    </>
                )}
                <div className="mt-3">
                    <button className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} mr-2`} onClick={toggleFavorite}>
                        <i className="fa fa-heart"></i> Favorite
                    </button>
                    <button className="btn btn-info">Comments</button>
                </div>
                {post.userId === user.id && (
                    <div className="edit-container">
                        <img src="src/assets/images/EditButton.png" alt="Edit Button" className="edit-button" onClick={toggleOptions}/>
                    </div>
                )}
                {showOptions && (
                    <div ref={optionsRef} className="options-bar">
                        {!editMode && <button className="btn btn-secondary" onClick={handleEdit}>Edit Post</button>}
                        <button className="btn btn-danger" onClick={handleDelete}>Delete Post</button>
                        <button className="btn btn-warning" onClick={handleHide}>{post.Active ? "Hide Post" : "Unhide Post"}</button>
                    </div>
                )}
                {showSuccess && (
                    <div className="alert alert-success notification-card" role="alert">
                        <strong>Success!</strong> Your information has been updated!
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setShowSuccess(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostCard;




