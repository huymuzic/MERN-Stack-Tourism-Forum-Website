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
    }, [id, user]);  // Note: Be cautious with including state that changes often as dependencies

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
    const handleDeleteUser =  async () => {}
    return (
        <Container className="mt-4">
            <Row className="justify-content-center mb-3">
            <Col md={10}>
            <Card className="p-3 user-profile-card">
                <Row className="align-items-start">
                    <Col xs={12} md={8} className="d-flex align-items-center">
                        <img src={getAvatarUrl(otherUserInfo.avatar, baseURL)} alt="User Avatar" className="rounded-circle me-3" />
                        <div className="user-info">
                            <h2>{otherUserInfo.name} {otherUserInfo.role === 'admin' && <i className="fa fa-shield-alt"></i>}</h2>
                            <p>@{otherUserInfo.username}</p>
                            <p>Joined: {new Date(otherUserInfo?.createdAt).toLocaleDateString()}</p>
                            <div className="stats">
                                <Button variant="outline-primary" size="sm" className="me-2">Posts: {otherUserInfo.posts ? otherUserInfo.posts.length : 0}</Button>
                                <Button variant="outline-success" size="sm">Favorites: {otherUserInfo.likes ? otherUserInfo.likes.length : 0}</Button>
                            </div>
                        </div>
                    </Col>
                    {(user?.role === 'admin' || user?._id === otherUserInfo._id) && (
                        <Col xs="auto" className="align-items-end "> 
                            <Dropdown className="ellipsis-dropdown">
                                <Dropdown.Toggle variant="light" id="dropdown-basic">
                                    <span>. . .</span> 
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={handleToggleStatus}>Toggle Status</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/account')}>Edit Profile</Dropdown.Item>
                                    <Dropdown.Item onClick={handleDeleteUser} className="text-danger">Delete Account</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                            )}
                    </Row>
                        <Nav variant="tabs" activeKey={activeNav} onSelect={(selectedKey) => setActiveNav(selectedKey)} className="mt-3">
                            <Nav.Item>
                                <Nav.Link eventKey="Posts">Posts</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Favorites">Favorites</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card>
            </Col>
            </Row>
            <Row className="justify-content-center mb-3">
                <Col md={10} className="align-items-center">
                    {otherUserInfo.status === 'active' ? (
                        <ActiveComponent className="text-center align-items-center"/>
                    ) : (
                        <Card className="text-center align-items-center">
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



