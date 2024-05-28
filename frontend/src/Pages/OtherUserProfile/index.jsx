import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../utils/UserContext";
import UserPosts from "./components/UserPosts";
import { useTheme } from "../../theme/Theme.jsx";
import Favorites from "./components/Favorites";
import { getAvatarUrl } from "../../utils/getAvar.js";
import {
  Button,
  Card,
  Container,
  Dropdown,
  Row,
  Col,
  Nav,
} from "react-bootstrap";
import { pushSuccess, pushError } from "../../components/Toast";
import PopUpBase from "../../components/pop-up/PopUpBase";
import { usePopUp } from "../../components/pop-up/usePopup";
import { baseUrl } from "../../config";

const OtherUserProfile = () => {
  const { user, setUser } = useUser();
  const { id } = useParams();
  const { color } = useTheme();
  const [otherUserInfo, setOtherUserInfo] = useState({});
  const [activeNav, setActiveNav] = useState("Posts");
  const navigate = useNavigate();
  const NAV_ITEMS = {
    Posts: UserPosts,
    Favorites: Favorites,
  };
  const ActiveComponent = NAV_ITEMS[activeNav];
  const popUpActivate = usePopUp();
  const popUpDeactivate = usePopUp();
  const popUpLock = usePopUp();
  const popUpUnlock = usePopUp();
  const dropdownRef = useRef(null); 

  useEffect(() => {
    fetchOtherUserInfo();
  }, [id, user]);

  const elementsRef = useRef([]);

  const fetchOtherUserInfo = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/users/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOtherUserInfo(data.data);
      } else {
        pushError(data.message || "Failed to fetch user info");
      }
    } catch (error) {
      pushError("Network error");
    }
  };

  const handleToggleStatus = () => {
    if (otherUserInfo.status === "active") {
      popUpDeactivate.setTrue();
    } else {
      popUpActivate.setTrue();
    }
  };

  const onActivateConfirm = async () => {
    try {
      const url = new URL(`${baseUrl}/api/v1/users/active/${id}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Active account successfully");
        fetchOtherUserInfo();
      } else {
        pushError("Failed to active account");
        throw new Error("Failed to active account");
      }
    } catch {}
    popUpActivate.onClose();
  };

  const onDeactivateConfirm = async () => {
    try {
      const url = new URL(`${baseUrl}/api/v1/users/inactive/${id}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Inactive account successfully");
        fetchOtherUserInfo();
      } else {
        pushError("Failed to inactive account");
        throw new Error("Failed to inactive account");
      }
    } catch {}
    popUpDeactivate.onClose();
  };

  const onChangeStatus = () => {
    if (otherUserInfo.status == "locked") {
      popUpUnlock.setTrue();
    } else {
      popUpLock.setTrue();
    }
  };

  const handleLockConfirm = async () => {
    try {
      const url = new URL(`${baseUrl}/api/v1/users/lock/${id}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Lock user successfully");
        fetchOtherUserInfo();
      } else {
        pushError("Failed to lock user");
        throw new Error("Failed to lock user");
      }
    } catch (error) {}

    popUpLock.onClose();
  };

  const handleUnLockConfirm = async () => {
    try {
      const url = new URL(`${baseUrl}/api/v1/users/unlock/${id}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Unlock user successfully");
        fetchOtherUserInfo();
      } else {
        pushError("Failed to unlock user");
        throw new Error("Failed to unlock user");
      }
    } catch (error) {}

    popUpUnlock.onClose();
  };

  const handleDropdownToggle = (isOpen) => {
    if (isOpen) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.bottom > windowHeight) {
        dropdownRef.current.classList.add('dropup');
      } else {
        dropdownRef.current.classList.remove('dropup');
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center mb-3">
        <Col md={12}>
          <Card className="p-3 user-profile-card">
            <Row className="align-items-start flex-column flex-md-row">
              <Col xs={12} md={9} className="d-flex align-items-center flex-column flex-md-row">
                <img
                  src={getAvatarUrl(otherUserInfo.avatar, baseUrl)}
                  alt="User Avatar"
                  className="rounded-circle me-3 mb-3 mb-md-0"
                  width={"200px"}
                  height={"200px"}
                  tabIndex="0"
                />
                <div className="user-info text-center text-md-start">
                  <h2 tabIndex="0">
                    {otherUserInfo.name}{" "}
                    {otherUserInfo.role === "admin" && (
                      <i className="fa fa-shield-alt" aria-label="Admin" tabIndex="0"></i>
                    )}
                  </h2>
                  <p tabIndex="0">@{otherUserInfo.username}</p>
                  <p tabIndex="0">
                    Joined:{" "}
                    {new Date(otherUserInfo?.createdAt).toLocaleDateString()}
                  </p>
                  <div className="stats">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      tabIndex="0"
                      aria-label={`Posts: ${otherUserInfo.posts ? otherUserInfo.posts.length : 0}`}
                    >
                      Posts:{" "}
                      {otherUserInfo.posts ? otherUserInfo.posts.length : 0}
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      tabIndex="0"
                      aria-label={`Favorites: ${otherUserInfo.likes ? otherUserInfo.likes.length : 0}`}
                    >
                      Favorites:{" "}
                      {otherUserInfo.likes ? otherUserInfo.likes.length : 0}
                    </Button>
                  </div>
                </div>
              </Col>
              {(user?.role === "admin" || user?._id === otherUserInfo._id) && (
                <Col xs="auto" className="d-flex align-items-center">
                  <Dropdown
                    className="ellipsis-dropdown"
                    ref={dropdownRef}
                    onToggle={(isOpen) => handleDropdownToggle(isOpen)}
                  >
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                      <span>. . .</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleToggleStatus} tabIndex="0">
                        Toggle Status
                      </Dropdown.Item>
                      {user?._id === otherUserInfo._id && (
                        <Dropdown.Item onClick={() => navigate("/my-account")} tabIndex="0">
                          Edit Profile
                        </Dropdown.Item>
                      )}
                      {user?.role === "admin" && (
                        <Dropdown.Item
                          onClick={onChangeStatus}
                          className="text-danger"
                          tabIndex="0"
                        >
                          {otherUserInfo.status === "locked"
                            ? "Unlock Account"
                            : "Lock Account"}
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              )}
            </Row>
            <Nav
              variant="tabs"
              activeKey={activeNav}
              onSelect={(selectedKey) => setActiveNav(selectedKey)}
              className="mt-3"
              role="tablist"
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="Posts"
                  className={activeNav === "Posts" ? "btn-primary" : ""}
                  tabIndex="0"
                  aria-selected={activeNav === "Posts"}
                  role="tab"
                >
                  Posts
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="Favorites"
                  className={activeNav === "Favorites" ? "btn-primary" : ""}
                  tabIndex="0"
                  aria-selected={activeNav === "Favorites"}
                  role="tab"
                >
                  Favorites
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col md={10} className="align-items-center">
          {otherUserInfo.status === "active" ? (
            <ActiveComponent className="text-center align-items-center" tabIndex="0" />
          ) : (
            <Card className="text-center align-items-center">
              <Card.Body>
                <Card.Title tabIndex="0">Account Inactive</Card.Title>
                <p tabIndex="0">
                  Your Account is inactive right now! Please reactivate it to
                  perform any actions.
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <PopUpBase
        {...popUpActivate}
        onConfirm={onActivateConfirm}
        title="Activate Account"
        desc="Are you sure you want to activate this account?"
      />
      <PopUpBase
        {...popUpDeactivate}
        onConfirm={onDeactivateConfirm}
        title="Deactivate Account"
        desc="Are you sure you want to deactivate this account?"
      />
      <PopUpBase
        {...popUpLock}
        onConfirm={handleLockConfirm}
        title="Lock User Confirmation"
        desc={`Are you sure you want to lock the user ${otherUserInfo.username}?`}
      />
      <PopUpBase
        {...popUpUnlock}
        onConfirm={handleUnLockConfirm}
        title="Unlock User Confirmation"
        desc={`Are you sure you want to unlock the user ${otherUserInfo.username}?`}
      />
    </Container>
  );
};

export default OtherUserProfile;
