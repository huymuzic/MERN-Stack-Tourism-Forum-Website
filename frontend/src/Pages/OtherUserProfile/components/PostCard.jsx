import React, { useState, useEffect, useRef } from "react";
import { SlShare } from "react-icons/sl";
import { Card, Button, Row, Col, Container, Dropdown, Image } from "react-bootstrap";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import { useUser } from "../../../utils/UserContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme/Theme.jsx";
import { pushError } from "../../../components/Toast";
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
          <Card className="mb-4 shadow-sm" role="article" tabIndex="0" aria-labelledby={`post-title-${post._id}`}>
            <Card.Body>
              <Row className="align-items-center">
                <Col xs={9}>
                  <Card.Title as="h2" id={`post-title-${post._id}`} tabIndex="0"><strong>{post.title}</strong></Card.Title>
                  <Card.Subtitle as="h3" className="mb-2 text-muted" aria-label={`Posted by @${post.authorId?.username}`} tabIndex="0">@{post.authorId?.username}</Card.Subtitle>
                  <Card.Text as="time" dateTime={new Date(post.createdAt).toISOString()} tabIndex="0" aria-label={`Posted on ${new Date(post.createdAt).toLocaleString()}`}>
                    <small>{new Date(post.createdAt).toLocaleString()}</small>
                  </Card.Text>
                </Col>
                {(post.authorId?._id === user?._id || user?.role === 'admin') && (
                  <Col xs={3}>
                    <Dropdown ref={optionsRef} show={showOptions} onToggle={toggleOptions}>
                      <Dropdown.Toggle
                        variant="link"
                        className="p-0"
                        id="dropdown-basic"
                        onClick={toggleOptions}
                        aria-haspopup="true"
                        aria-expanded={showOptions}
                        aria-label="Options"
                      >
                        <SlShare size={24} alt="Options" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item onClick={handleEdit} tabIndex="0">Edit Post</Dropdown.Item>
                        <Dropdown.Item onClick={handleButtonClick} tabIndex="0">
                          {post.status === "unarchived" ? "Hide Post" : "Unhide Post"}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => popUpDelete.setTrue()} tabIndex="0">Delete Post</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                )}
              </Row>
              <Card.Text as="div" dangerouslySetInnerHTML={{ __html: post.content }} tabIndex="0" />
              {post.image && (
                <Image src={post.image} alt="Post content" fluid rounded className="mt-3" tabIndex="0" />
              )}
              <Row className="mt-3 align-items-center">
                <Col xs={12} className="mb-2 mb-sm-0" tabIndex="0" aria-label={`Liked by ${post.likes.length} users and contains ${post.childrenIds.length} comments`}>
                  <span className="d-block"><strong>Liked:</strong> {post.likes.length}</span>
                  <span className="d-block"><strong>Comments:</strong> {post.childrenIds.length}</span>
                </Col>
              </Row>
              <Row className="mt-3 align-items-center">
                <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                  <Button
                    variant={isLiked ? "danger" : "outline-danger"}
                    onClick={handleLike}
                    className="me-2"
                    aria-pressed={isLiked}
                    aria-label={isLiked ? "Unlike" : "Like"}
                  >
                    {isLiked ? <FaHeart /> : <FaRegHeart />} {isLiked ? "Liked" : "Like"}
                  </Button>
                </Col>
                <Col xs={12} sm={6} className="text-sm-end mt-3 mt-sm-0">
                  <Button
                    variant="outline-primary"
                    onClick={handleCommentsClick}
                    aria-label="Comments"
                    className="me-2"
                  >
                    <FaComment /> {post.childrenIds.length || 0} Comments
                  </Button>
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
