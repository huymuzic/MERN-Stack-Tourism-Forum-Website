import React, { useState, useEffect, useRef } from "react";
// import "./PostCard.css";
import { SlShare } from "react-icons/sl";
import { Card, Button, Row, Col, Container, Dropdown, Image } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import { useUser } from "../../../utils/UserContext";
import { useNavigate } from "react-router-dom";


function PostCard({ post, onToggleLike, handleLockConfirm, handleUnLockConfirm }) {
    const [editMode, setEditMode] = useState(false);
    const { user} = useUser();
    const [isLiked, setIsLiked] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.likes) {
            setIsLiked(user.likes.includes(post._id));
        }
    }, [user, post._id]);

    const handleEdit = () => {
        navigate(`/forum/p/${post._id}`);
    };

    const handleLike = () => {
        onToggleLike(post._id);
        setIsLiked(!isLiked);
    };

    const handleButtonClick = () => {
        if (post.status === "archived") {
            handleUnLockConfirm(post._id)
        } 
        if  (post.status === "unarchived") {
            handleLockConfirm(post._id)
        }
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
        <Container>
        <Row className="justify-content-center mb-3">
            <Col xs={12} sm={12} md={12} lg={12}>
                <Card className="mb-4 flex-column">
                    <Card.Body>
                        <Row>
                        <Col  className="align-items-center">
                            <Card.Title><strong>{post.title}</strong></Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">@{post.authorId.username}</Card.Subtitle>
                            <Card.Text><small>{new Date(post.createdAt).toLocaleString()}</small></Card.Text>
                        </Col>
                        {(post.authorId._id === user?._id || user?.role === 'admin') && (
                            <Col xs="auto" className="align-items-end ">
                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic">
                                        <SlShare alt="Edit Button" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={handleEdit}>Edit Post</Dropdown.Item>
                                        <Dropdown.Item onClick={handleButtonClick}>
                                            {post.status === "unarchived" ? "Hide Post" : "Unhide Post"}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        )}
                    </Row>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        {post.image && (
                            <Image src={post.image} alt="Post content" fluid rounded className="mt-3" />
                        )}

                        <Card.Text className="mt-2">
                            <strong>Liked:</strong> {post.likes.length} <strong>Comments:</strong> {post.childrenIds.length}
                        </Card.Text>

                        <Button variant={isLiked ? "danger" : "outline-danger"} onClick={handleLike} className="mr-2">
                            {isLiked ? <FaHeart /> : <FaRegHeart />} {isLiked ? "Liked" : "Like"}
                        </Button>
                        <Button variant="outline-primary" onClick={handleCommentsClick}>
                            <FaComment /> {post.childrenIds.length || 0} Comments
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
    );
}

export default PostCard;
