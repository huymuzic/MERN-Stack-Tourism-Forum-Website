import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Row, Stack } from 'react-bootstrap';
import { pushError, pushSuccess } from '../../components/Toast';
import { useUser } from '../../utils/UserContext';
import { getAvatarUrl } from '../../utils/getAvar';
import moment from 'moment';
import './index.css'
import CustomTooltip from '../../components/CustomTooltip';
import { FaEdit } from 'react-icons/fa';
import PopUpUpdateProfile from './components/PopUpUpdateProfile'
import { usePopUp } from '../../components/pop-up/usePopup';
import { userStatuses } from '../Admin/components/users/UserItem';
import PopUpBase from '../../components/pop-up/PopUpBase';
import { useNavigate } from 'react-router-dom';

export default function MyAccount() {
    const popUpActivate = usePopUp();
    const popUpEditProfile = usePopUp();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [userProfile, setUserProfile] = useState({
        username: "",
        email: "",
        status: "active"
    })
    const [avatar, setAvatar] = useState()

    const userStatus = userStatuses.find((item) => item.Value === userProfile.status)

    const handleActivateConfirm = async () => {
        try {
            const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/users/lock/${user._id}`);
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                pushSuccess('Activate user successfully');
                fetchUser()
            } else {
                pushError('Failed to activate user');
                throw new Error('Failed to activate user');
            }
        } catch (error) {
            pushError('Failed to activate user');
        }
    };

    const handleDeactivateConfirm = async () => {
        try {
            const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/users/unlock/${user._id}`);
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                pushSuccess('Deactivate user successfully');
                fetchUser()
            } else {
                pushError('Failed to deactivate user');
                throw new Error('Failed to deactivate user');
            }
        } catch (error) {
            pushError('Failed to deactivate user');
        }
    };

    const onChangeStatus = () => {
        popUpActivate.onClose()
        if (userStatus.Value == "active") {
            return handleActivateConfirm()
        } else {
            return handleDeactivateConfirm()
        }

    }

    const handleUpdateProfile = async (partialUserUpdate) => {
        popUpEditProfile.onClose()
        try {
            const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/users/${user._id}`);
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id, name: partialUserUpdate?.name, email: partialUserUpdate?.email, password: partialUserUpdate?.password }),

            });
            if (response.ok) {
                pushSuccess('Edit user successfully');
                fetchUser()
            } else {
                pushError('Failed to edit user');
                throw new Error('Failed to edit user');
            }
        } catch (error) {
            pushError('Failed to edit user');
        }
    };
    const fetchUser = async () => {
        setLoading(true);
        const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/users/${user._id}`);

        try {
            const response = await fetch(url, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                pushError('Failed to get user');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setAvatar(getAvatarUrl(data.data.avatar, import.meta.env.VITE_BASE_URL))
            setUserProfile(data.data)
        } catch (error) {
            console.log("🚀 ~ fetchUser ~ error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('home')
        }
        fetchUser();
    }, [user]);

    return (
        <Container className='m-5' style={{ padding: "40px", border: "1px solid #ddd", borderRadius: "8px", textAlign: "center" }}>
            <Row className="mb-2 max-width-500 mx-auto">
                <Col className="d-flex justify-content-center">
                    <Image src={avatar} alt="User Avatar" roundedCircle width={200} height={200} />
                </Col>
            </Row>

            <Stack direction='horizontal' gap={2} className="mb-4 max-width-500 mx-auto" style={{ justifyContent: "center" }}>
                <UserStatusDot
                    status={userProfile?.status}
                />

                <CustomTooltip text={userStatus.Value == "active" ? "Deactive" : "Activate"}>
                    <Form >
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            checked={userStatus.Value == "active" ? true : false}
                            onClick={() => popUpActivate.setTrue()}
                        />
                    </Form>
                </CustomTooltip>

                <PopUpBase
                    {...popUpActivate}
                    onConfirm={onChangeStatus}
                    title="Unlock User Confirmation"
                    desc={`Are you sure you want to unlock the user ${userProfile.username}?`}
                />
            </Stack>

            <Row className="mb-3 justify-content-between max-width-500 mx-auto">
                <Col className="text-right"><h6>Email:</h6></Col>
                <Col className="text-left"><p className='body-1'>{userProfile?.email}</p></Col>
            </Row>
            <Row className="mb-3 justify-content-between max-width-500 mx-auto">
                <Col className="text-right"><h6>Username:</h6></Col>
                <Col className="text-left"><p className='body-1'>{userProfile?.username}</p></Col>
            </Row>
            <Row className="mb-3 justify-content-between max-width-500 mx-auto">
                <Col className="text-right"><h6>Name:</h6></Col>
                <Col className="text-left"><p className='body-1'>{userProfile?.name}</p></Col>
            </Row>
            <Row className="mb-3 justify-content-between max-width-500 mx-auto">
                <Col className="text-right"><h6>Joined at:</h6></Col>
                <Col className="text-left"><p className='body-1'>{moment(userProfile?.createdAt).format("YYYY-MM-DD HH:mm:ss")}</p></Col>
            </Row>
            <Row className="mb-3 justify-content-between max-width-500 mx-auto">
                <Col className="text-right"><h6>Password:</h6></Col>
                <Col className="text-left">
                    <Stack direction="horizontal" style={{ justifyContent: "space-around", alignItems: "center" }}>
                        <p className='body-1'>**********</p>
                        <CustomTooltip text='Edit password'>
                            <Button variant='outline-primary' style={{ padding: "0px 8px" }}>
                                <FaEdit style={{ cursor: "pointer" }} size={"12px"}></FaEdit>
                            </Button>
                        </CustomTooltip>
                    </Stack>
                </Col>
            </Row>

            <Row className=" justify-content-between max-width-500 mx-auto">
                <Col >
                    <Button onClick={() => popUpEditProfile.setTrue()}>
                        Edit Profile
                    </Button>

                    <PopUpUpdateProfile
                        {...popUpEditProfile}
                        user={userProfile}
                        onConfirm={(data) => handleUpdateProfile(data)}
                    />

                </Col>
                <Col>
                    <Button variant="outline-primary">
                        Edit Theme
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
const UserStatusDot = ({ status }) => {
    const userStatus = userStatuses.find((item) => item.Value === status);

    return (
        // <div className="px-2 py-1 rounded" style={{ backgroundColor: userStatus?.bgColor }}>
        //     <p style={{ color: userStatus?.color, margin: 0 }}>{userStatus?.Name}</p>
        // </div>

        <Stack direction='horizontal' gap={2}>
            <div style={{ width: "12px", height: "12px", borderRadius: "100%", backgroundColor: userStatus?.color }}></div>
            <p>{userStatus?.Name}</p>
        </Stack>
    );
};