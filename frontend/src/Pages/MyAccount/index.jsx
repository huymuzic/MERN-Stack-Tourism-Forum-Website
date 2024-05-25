import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Row, Stack } from "react-bootstrap";
import { pushError, pushSuccess } from "../../components/Toast";
import { useUser } from "../../utils/UserContext";
import { getAvatarUrl } from "../../utils/getAvar";
import moment from "moment";
import "./index.css";
import CustomTooltip from "../../components/CustomTooltip";
import { FaEdit } from "react-icons/fa";
import PopUpUpdateProfile from "./components/PopUpUpdateProfile";
import { usePopUp } from "../../components/pop-up/usePopup";
import { userStatuses } from "../Admin/components/users/UserItem";
import PopUpBase from "../../components/pop-up/PopUpBase";
import CircularProgress from "../../components/CircularProgress";
import PopUpEditTheme from "./components/PopUpEditTheme";
import { useTheme } from "../../theme/Theme";
import PopUpEditPassword from "./components/PopUpEditPassword";
import { baseUrl } from "../../config";
import color from "../../theme/Color";
import { useNavigate } from "react-router-dom";

export const defaultSettingTheme = {
  primary: color.primary,

  secondary: color.secondary,

  headerBgColor: color.headerBgColor,
  headerTextColor: color.headerTextColor,

  buttonTextColor: color.buttonTextColor,
  buttonHoverColor: color.buttonHoverColor,
};

export default function MyAccount() {
  const popUpActivate = usePopUp();
  const popUpEditProfile = usePopUp();
  const popUpEditPassword = usePopUp();
  const popUpEditTheme = usePopUp();
  const { user, isFetchedUser } = useUser();
  const [loading, setLoading] = useState(false);
  const { fetchTheme } = useTheme();
  const [userProfile, setUserProfile] = useState({
    username: "",
    email: "",
    status: "active",
  });
  const [avatar, setAvatar] = useState();
  const userStatus = userStatuses.find(
    (item) => item.Value === userProfile.status
  );
  const navigate = useNavigate();

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    popUpEditPassword.onClose();
    try {
      const response = await fetch(`${baseUrl}/api/v1/users/verify-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: currentPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        handleUpdateProfile({ password: newPassword });
      } else {
        pushError("Incorrect password, please try again.");
        throw new Error(
          data.message || "Incorrect password, please try again."
        );
      }
    } catch (error) {
      pushError(error);
    }
  };
  const handleActivateConfirm = async () => {
    try {
      const url = new URL(`${baseUrl}/api/v1/users/inactive/${user._id}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Activate user successfully");
        fetchUser();
      } else {
        pushError("Failed to activate user");
        throw new Error("Failed to activate user");
      }
    } catch (error) {
      pushError("Failed to activate user");
    }
  };

  const handleDeactivateConfirm = async () => {
    try {
      const url = new URL(`${baseUrl}/api/v1/users/active/${user._id}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Deactivate user successfully");
        fetchUser();
      } else {
        pushError("Failed to deactivate user");
        throw new Error("Failed to deactivate user");
      }
    } catch (error) {
      pushError("Failed to deactivate user");
    }
  };

  const onChangeStatus = () => {
    popUpActivate.onClose();
    if (userStatus.Value == "active") {
      return handleActivateConfirm();
    } else {
      return handleDeactivateConfirm();
    }
  };

  const handleUpdateProfile = async (partialUserUpdate) => {
    popUpEditProfile.onClose();
    try {
      const url = new URL(`${baseUrl}/api/v1/users/${user._id}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          name: partialUserUpdate?.name,
          email: partialUserUpdate?.email,
          password: partialUserUpdate?.password,
        }),
      });
      if (response.ok) {
        fetchUser();
        pushSuccess("Edit user successfully");
      } else {
        pushError("Failed to edit user");
        throw new Error("Failed to edit user");
      }
    } catch (error) {
      pushError("Failed to edit user");
    }
  };

  const handleAvatarUpdate = async (avatar) => {
    if (!avatar) return;
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await fetch(
        `${baseUrl}/api/v1/users/upload-avatar/${user._id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );
      await response.json();
      if (response.ok) {
        window.location.reload();
        fetchUser();
      } else {
        pushError("Failed to update avatar");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const handleUpdateTheme = async (settingTheme) => {
    popUpEditTheme.onClose();
    try {
      const url = new URL(`${baseUrl}/api/v1/users/theme`);
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userProfile._id,
          themeData: settingTheme,
        }),
      });
      if (response.ok) {
        pushSuccess("Edit theme successfully");
        fetchTheme();
        fetchUser();
      } else {
        pushError("Failed to edit theme");
        throw new Error("Failed to edit theme");
      }
    } catch (error) {
      pushError("Failed to edit theme");
    }
  };
  const fetchUser = async () => {
    setLoading(true);
    const url = new URL(`${baseUrl}/api/v1/users/${user._id}`);

    try {
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        pushError("Failed to get user");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setAvatar(getAvatarUrl(data?.data?.avatar, baseUrl));
      setUserProfile(data?.data);
    } catch (error) {
      pushError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  useEffect(() => {
    if (isFetchedUser) {
      if (!user) {
        navigate("/home");
      }
    }
  }, [isFetchedUser]);

  return (
    <div
      className="m-5"
      style={{
        padding: "40px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      {loading ? (
        <div className="home__loading">
          <CircularProgress />
        </div>
      ) : (
        <>
          <Row className="mb-2 max-width-500 mx-auto">
            <Col className="d-flex justify-content-center">
              <Image
                src={avatar}
                alt="User Avatar"
                roundedCircle
                width={200}
                height={200}
              />
            </Col>
          </Row>

          <Stack
            direction="horizontal"
            gap={2}
            className="mb-4 max-width-500 mx-auto"
            style={{ justifyContent: "center" }}
          >
            <UserStatusDot status={userProfile?.status} />

            <CustomTooltip
              text={userStatus.Value == "active" ? "Deactive" : "Activate"}
            >
              <Form>
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
              title={
                userStatus.Value == "active"
                  ? "Deactivate your account"
                  : "Activate your account"
              }
              desc={`Are you sure you want to ${
                userStatus.Value == "active" ? "deactivate" : "activate"
              } your account?`}
            />
          </Stack>

          <Row className="mb-3 justify-content-between max-width-500 mx-auto">
            <Col md={6} xs={12} className="text-right">
              <h6>Email:</h6>
            </Col>
            <Col md={6} xs={12} className="text-left">
              <p className="body-1">{userProfile?.email}</p>
            </Col>
          </Row>
          <Row className="mb-3 justify-content-between max-width-500 mx-auto">
            <Col md={6} xs={12} className="text-right">
              <h6>Username:</h6>
            </Col>
            <Col md={6} xs={12} className="text-left">
              <p className="body-1">{userProfile?.username}</p>
            </Col>
          </Row>
          <Row className="mb-3 justify-content-between max-width-500 mx-auto">
            <Col md={6} xs={12} className="text-right">
              <h6>Name:</h6>
            </Col>
            <Col md={6} xs={12} className="text-left">
              <p className="body-1">{userProfile?.name}</p>
            </Col>
          </Row>
          <Row className="mb-3 justify-content-between max-width-500 mx-auto">
            <Col md={6} xs={12} className="text-right">
              <h6>Joined at:</h6>
            </Col>
            <Col md={6} xs={12} className="text-left">
              <p className="body-1">
                {moment(userProfile?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </p>
            </Col>
          </Row>
          <Row className="mb-3 justify-content-between max-width-500 mx-auto">
            <Col md={6} xs={12} className="text-right">
              <h6>Password:</h6>
            </Col>
            <Col md={6} xs={12} className="text-left">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p className="body-1">***********</p>
                <CustomTooltip text="Edit password">
                  <Button
                    variant="outline-primary"
                    style={{ padding: "0px 8px" }}
                    onClick={() => popUpEditPassword.setTrue()}
                  >
                    <FaEdit
                      style={{ cursor: "pointer" }}
                      size={"12px"}
                    ></FaEdit>
                  </Button>
                </CustomTooltip>
                <PopUpEditPassword
                  {...popUpEditPassword}
                  onConfirm={(data) => {
                    handleChangePassword(data);
                  }}
                />
              </div>
            </Col>
          </Row>

          <Row className=" justify-content-between max-width-500 mx-auto">
            <Col md={6} xs={12} className="mb-3">
              <Button onClick={() => popUpEditProfile.setTrue()}>
                Edit Profile
              </Button>

              <PopUpUpdateProfile
                {...popUpEditProfile}
                user={userProfile}
                onConfirm={(data) => {
                  handleUpdateProfile(data.user);
                  handleAvatarUpdate(data.avatar);
                }}
              />
            </Col>
            <Col md={6} xs={12} className="mb-3">
              <Button
                variant="outline-primary"
                onClick={() => popUpEditTheme.setTrue()}
              >
                Edit Theme
              </Button>

              <PopUpEditTheme
                {...popUpEditTheme}
                settingColors={{
                  ...defaultSettingTheme,
                  ...userProfile?.theme,
                }}
                onSave={(data) => handleUpdateTheme(data)}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
const UserStatusDot = ({ status }) => {
  const userStatus = userStatuses.find((item) => item.Value === status);

  return (
    // <div className="px-2 py-1 rounded" style={{ backgroundColor: userStatus?.bgColor }}>
    //     <p style={{ color: userStatus?.color, margin: 0 }}>{userStatus?.Name}</p>
    // </div>

    <Stack direction="horizontal" gap={2}>
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "100%",
          backgroundColor: userStatus?.color,
        }}
      ></div>
      <p className="body-1">{userStatus?.Name}</p>
    </Stack>
  );
};
