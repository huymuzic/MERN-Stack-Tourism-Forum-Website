import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import { FaLock, FaUnlock } from "react-icons/fa";
import CustomTooltip from "../../../../components/CustomTooltip";
import { usePopUp } from "../../../../components/pop-up/usePopup";
import PopUpBase from "../../../../components/pop-up/PopUpBase";
import color from "../../../../theme/Color";
import { Button, Col, Container, Form, Image, Row, Stack } from 'react-bootstrap';

export default function UserItem({
  user,
  handleLockConfirm,
  handleUnLockConfirm,
  handleInactiveCofirm,
  handleActiveConfirm
}) {
  const popUpLock = usePopUp();
  const popUpUnLock = usePopUp();
  const popUpActivate = usePopUp();
  const userStatus = userStatuses.find((item) => item.Value === user.status);

  const onChangeStatus = () => {
    popUpActivate.onClose();
    if (userStatus.Value === "active") {
      return handleInactiveCofirm(user._id);
    } else {
      return handleActiveConfirm(user._id);
    }
  };

  const onUnLockConfirm = async () => {
    popUpUnLock.onClose();
    handleUnLockConfirm(user._id);
  };

  const onLockConfirm = async () => {
    popUpLock.onClose();
    handleLockConfirm(user._id);
  };

  return (
    <div className="card mb-3" tabIndex="0" aria-label={`User card for ${user.username}`}>
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
            <Link
              to={`/profile/${user._id}`}
              className="d-flex align-items-end text-decoration-none mb-2 mb-md-0"
              tabIndex="0"
              aria-label={`View profile of ${user.username}`}
            >
              <h5 className="card-title mb-0" style={{ cursor: 'pointer' }}>
                {user.username}
              </h5>
            </Link>
            <div className="ms-0 ms-md-3">
              <UserStatusBox status={user.status} />
            </div>
          </div>
          {user.role !== 'admin' && (
            <div className="d-flex mt-2 mt-md-0">
              <div className="me-2">
                {user.status !== "locked" && (
                  <Stack direction="horizontal" gap={2} className="mb-4 max-width-500 mx-auto" style={{ justifyContent: "center" }}>
                    <UserStatusDot status={user.status} />
                    <CustomTooltip text={userStatus.Value === "active" ? "Deactivate" : "Activate"}>
                      <Form>
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          checked={userStatus.Value === "active"}
                          onClick={() => popUpActivate.setTrue()}
                          aria-label={`Toggle user status for ${user.username}`}
                          tabIndex="0"
                        />
                      </Form>
                    </CustomTooltip>
                    <PopUpBase
                      {...popUpActivate}
                      onConfirm={onChangeStatus}
                      title="Change User Status Confirmation"
                      desc={`Are you sure you want to ${userStatus.Value === "active" ? "deactivate" : "activate"} the user ${user.username}?`}
                    />
                  </Stack>
                )}
              </div>
              <div>
                {user.status === 'locked' ? (
                  <>
                    <CustomTooltip text="Unlock user" position="top">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => popUpUnLock.setTrue()}
                        aria-label="Unlock user"
                        tabIndex="0"
                      >
                        <FaLock color="inherit" size={14} />
                      </button>
                    </CustomTooltip>
                    <PopUpBase
                      {...popUpUnLock}
                      onConfirm={onUnLockConfirm}
                      title="Unlock User Confirmation"
                      desc={`Are you sure you want to unlock the user ${user.username}?`}
                    />
                  </>
                ) : (
                  <>
                    <CustomTooltip text="Lock user" position="top">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => popUpLock.setTrue()}
                        aria-label="Lock user"
                        tabIndex="0"
                      >
                        <FaUnlock color="inherit" size={14} />
                      </button>
                    </CustomTooltip>
                    <PopUpBase
                      {...popUpLock}
                      onConfirm={onLockConfirm}
                      title="Lock User Confirmation"
                      desc={`Are you sure you want to lock the user ${user.username}?`}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <hr />
        <div className="d-flex flex-column flex-md-row">
          <p className="card-text me-0 me-md-3 mb-1 mb-md-0" tabIndex="0" aria-label={`Email: ${user.email}`}>
            <strong className="text-muted">{`Email: ${user.email}`}</strong>
          </p>
          <p className="card-text mb-1 mb-md-0" tabIndex="0" aria-label={`Role: ${getUserRoleName(user.role)}`}>
            <strong className="text-muted">
              {`Role: ${getUserRoleName(user.role)}`}
            </strong>
          </p>
        </div>
        <div className="d-flex flex-column flex-md-row">
          <p className="card-text me-0 me-md-3 mb-1 mb-md-0" tabIndex="0" aria-label={`Created at: ${moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}`}>
            <small className="text-muted">
              {`Created At: ${moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}`}
            </small>
          </p>
          <p className="card-text mb-0" tabIndex="0" aria-label={`Updated at: ${moment(user.updatedAt).format("YYYY-MM-DD HH:mm:ss")}`}>
            <small className="text-muted">
              {`Updated At: ${moment(user.updatedAt).format("YYYY-MM-DD HH:mm:ss")}`}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

UserItem.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  handleLockConfirm: PropTypes.func.isRequired,
  handleUnLockConfirm: PropTypes.func.isRequired, 
  handleInactiveCofirm: PropTypes.func.isRequired,
  handleActiveConfirm: PropTypes.func.isRequired,
};

export const userStatuses = [
  {
    Id: 1,
    Value: "active",
    Name: "Active",
    bgColor: color.successLight,
    color: color.success,
  },
  {
    Id: 2,
    Value: "inactive",
    Name: "Inactive",
    bgColor: color.warningLight,
    color: color.warning,
  },
  { Id: 3, Value: "locked", Name: "Locked", bgColor: color.grey200, color: color.grey400 },
];

export const userRoles = [
  { Id: 1, Value: "user", Name: "User" },
  { Id: 2, Value: "admin", Name: "Admin" },
];

export const UserStatusBox = ({ status }) => {
  const userStatus = userStatuses.find((item) => item.Value === status);

  return (
    <div className="px-2 py-1 rounded" style={{ backgroundColor: userStatus?.bgColor }} tabIndex="0" aria-label={`User status: ${userStatus?.Name}`}>
      <p style={{ color: userStatus?.color, margin: 0 }}>{userStatus?.Name}</p>
    </div>
  );
};

const getUserRoleName = (role) => {
  const userRole = userRoles.find((item) => item.Value === role);
  return userRole ? userRole.Name : "";
};

UserStatusBox.propTypes = {
  status: PropTypes.string.isRequired,
};

const UserStatusDot = ({ status }) => {
  const userStatus = userStatuses.find((item) => item.Value === status);

  return (
    <Stack direction="horizontal" gap={2}>
      <div style={{ width: "12px", height: "12px", borderRadius: "100%", backgroundColor: userStatus?.color }}></div>
    </Stack>
  );
};
