import React, { useState, useEffect, useRef } from "react";
import { SlShare } from "react-icons/sl";
import { Card, Button, Row, Col, Container, Dropdown, Image } from "react-bootstrap";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import { useUser } from "../../../utils/UserContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme/Theme.jsx";
import { pushError, pushSuccess } from "../../../components/Toast";
import { usePopUp } from "../../../components/pop-up/usePopup";
import PopUpBase from "../../../components/pop-up/PopUpBase";
import './PostCard.css';  // Import custom CSS

function PostCard({ post, onToggleLike, handleLockConfirm, handleUnLockConfirm, handleDelete }) {
  const { user } = useUser();
  const { color } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.likes) {
      setIsLiked(user.likes.includes(post._id));
    }
  }, [user, post._id]);

  const popUpDelete = usePopUp();

  const handleEdit = () => {
    navigate(`/forum/p/${post._id}`);
  };

  const onDeleteConfirm = async () => {
    popUpDelete.onClose();
    handleDelete(post._id);
  };

  const handleLike = () => {
    if (!user) {
      navigate(`/login`);
      pushError("Please log in to perform this action");
    } else {
      onToggleLike(post._id);
      setIsLiked(!isLiked);
    }
  };

  const handleButtonClick = () => {
    if (post.status === "archived") {
      handleUnLockConfirm(post._id);
    } else {
      handleLockConfirm(post._id);
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
        <Col xs={12} md={10} lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col xs={9}>
                  <Card.Title><strong>{post.title}</strong></Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">@{post.authorId?.username}</Card.Subtitle>
                  <Card.Text><small>{new Date(post.createdAt).toLocaleString()}</small></Card.Text>
                </Col>
                {(post.authorId?._id === user?._id || user?.role === 'admin') && (
                  <Col xs={3}>
                    <Dropdown ref={optionsRef} show={showOptions} onToggle={toggleOptions}>
                      <Dropdown.Toggle
                        variant="link"
                        className="p-0"
                        id="dropdown-basic"
                        onClick={toggleOptions}
                      >
                        <SlShare size={24} alt="Options" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item onClick={handleEdit}>Edit Post</Dropdown.Item>
                        <Dropdown.Item onClick={handleButtonClick}>
                          {post.status === "unarchived" ? "Hide Post" : "Unhide Post"}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => popUpDelete.setTrue()}>Delete Post</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                )}
              </Row>
              <Card.Text dangerouslySetInnerHTML={{ __html: post.content }} />
              {post.image && (
                <Image src={post.image} alt="Post content" fluid rounded className="mt-3" />
              )}
              <Row className="mt-3 align-items-center">
                <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                  <Button
                    variant={isLiked ? "danger" : "outline-danger"}
                    onClick={handleLike}
                    className="me-2"
                  >
                    {isLiked ? <FaHeart /> : <FaRegHeart />} {isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button variant="outline-primary" onClick={handleCommentsClick}>
                    <FaComment /> {post.childrenIds.length || 0} Comments
                  </Button>
                </Col>
                <Col xs={12} sm={6} className="text-sm-end">
                  <span className="d-block d-sm-inline"><strong>Liked:</strong> {post.likes.length}</span>
                  <span className="d-block d-sm-inline ms-0 ms-sm-3"><strong>Comments:</strong> {post.childrenIds.length}</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <PopUpBase
        {...popUpDelete}
        onConfirm={onDeleteConfirm}
        title="Delete Post Confirmation"
        desc="Are you sure you want to delete this post?"
      />
    </Container>
  );
}

export default PostCard;
