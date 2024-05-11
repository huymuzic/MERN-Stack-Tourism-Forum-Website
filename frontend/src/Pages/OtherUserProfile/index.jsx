import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../utils/UserContext';
import UserPosts from './components/UserPosts';
import Favorites from './components/Favorites';
import { getAvatarUrl } from '../../utils/getAvar.js';
import { Button, Card, Container, Dropdown, Row, Col, Nav } from 'react-bootstrap';
import { pushSuccess, pushError } from '../../components/Toast';
import PopUpBase from '../../components/pop-up/PopUpBase';
import { usePopUp } from '../../components/pop-up/usePopup';
const OtherUserProfile = () => {
    const { user, setUser } = useUser();
    const { id } = useParams();
    const [otherUserInfo, setOtherUserInfo] = useState({});
    const [activeNav, setActiveNav] = useState('Posts');
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem('accessToken');
   
    const NAV_ITEMS = {
        Posts: UserPosts,
        Favorites: Favorites,
    };
    const ActiveComponent = NAV_ITEMS[activeNav];

    const popUpActivate = usePopUp();
    const popUpDeactivate = usePopUp();
    useEffect(() => {
        fetchOtherUserInfo();
    }, [id, baseURL, user, otherUserInfo]);  // Note: Be cautious with including state that changes often as dependencies

    const fetchOtherUserInfo = async () => {
        try {
            const response = await fetch(`${baseURL}/api/v1/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok) {
                setOtherUserInfo(data.data);
            } else {
                pushError(data.message || 'Failed to fetch user info');
            }
        } catch (error) {
            pushError('Network error');
        }
    };

    const handleToggleStatus = () => {
        if (otherUserInfo.status === 'active') {
            popUpDeactivate.setTrue();
        } else {
            popUpActivate.setTrue();
        }
    };

    const onActivateConfirm = async () => {
       
        try {
            const url = new URL(`${baseURL}/api/v1/users/unlock/${id}`);
            const response = await fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            });
            if (response.ok) {
              pushSuccess('Active account successfully');
              fetchOtherUserInfo()
            } else {
              pushError('Failed to active account');
              throw new Error('Failed to active account');
            }
          } catch {}
          popUpActivate.onClose();
    };

    const onDeactivateConfirm = async () => {
        
        try {
            const url = new URL(`${baseURL}/api/v1/users/lock/${id}`);
            const response = await fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            });
            if (response.ok) {
              pushSuccess('Inactive account successfully');
              fetchOtherUserInfo()
            } else {
              pushError('Failed to inactive account');
              throw new Error('Failed to inactive account');
            }
          } catch {}
          popUpDeactivate.onClose();
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center mb-3">
                <Col md={10}>
                    <Card>
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col xs="auto">
                                    <img src={getAvatarUrl(otherUserInfo.avatar, baseURL)} alt="User Avatar" className="rounded-circle" style={{ width: '150px', height: '150px' }} />
                                </Col>
                                <Col>
                                    <h2>{otherUserInfo.name} {otherUserInfo.role === 'admin' && <i className="fa-sharp fa-solid fa-shield-halved"></i>}</h2>
                                    <p>@{otherUserInfo.username}</p>
                                    <p>Joined: {new Date(otherUserInfo?.createdAt).toLocaleDateString()}</p>
                                    <div className="mb-3 d-flex">
                                    <span
                                        className="badge bg-primary me-2"
                                        style={{ fontSize: '1.25rem', padding: '10px' }}
                                    >
                                        Posts: {otherUserInfo.posts ? otherUserInfo.posts.length : 0}
                                    </span>
                                    <span
                                        className="badge bg-success"
                                        style={{ fontSize: '1.25rem', padding: '10px' }}
                                    >
                                        Favorites: {otherUserInfo.likes ? otherUserInfo.likes.length : 0}
                                    </span>
                                    </div>
                                </Col>
                                <Col>
                                {(user?.role === 'admin' || user?._id == otherUserInfo._id) && (
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary">Actions</Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={handleToggleStatus}>
                                                    {otherUserInfo.status === 'active' ? 'Inactivate' : 'Activate'} Account
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => navigate('/account')}>Edit Profile</Dropdown.Item>
                                                {user?.role === 'admin' && (
                                                    <Dropdown.Item onClick={handleDeleteUser} className="text-danger">Delete Account</Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </Col>
                            </Row>
                            <Nav variant="tabs" activeKey={activeNav} onSelect={(selectedKey) => setActiveNav(selectedKey)}>
                                <Nav.Item>
                                    <Nav.Link eventKey="Posts">Posts</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Favorites">Favorites</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    {otherUserInfo.status === 'active' ? (
                        <ActiveComponent />
                    ) : (
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Account Inactive</Card.Title>
                                <p>Your Account is inactive right now! Please reactivate it to perform any actions.</p>
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
        </Container>
    );
};

export default OtherUserProfile;



