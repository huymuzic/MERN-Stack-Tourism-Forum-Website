import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import { FaLock, FaUnlock, FaBan  } from "react-icons/fa";
import CustomToolTip from "../../../../components/CustomTooltip";
import { usePopUp } from "../../../../components/pop-up/usePopup";
import PopUpBase from "../../../../components/pop-up/PopUpBase";
import { Form, Stack } from 'react-bootstrap';
import CustomTooltip from '../../../../components/CustomTooltip';

export default function UserItem({
  user,
  handleLockConfirm,
  handleUnLockConfirm,
  handleInactiveCofirm,
  handleActiveConfirm
}) {
  const popUpLock = usePopUp();
  const popUpUnLock = usePopUp();
  const popUpActive = usePopUp();
  const userStatus = userStatuses.find((item) => item.Value === user.status)

  const onChangeStatus = () => {
    popUpActive.onClose()
    if (user.status == "active") {
        return handleInactiveCofirm(user._id)
    } else {
        return handleActiveConfirm(user._id)
    }

}
  const handleClockClick = () => {
    if (user.status === "locked") {
        popUpUnLock.setTrue();
      } else {
        popUpLock.setTrue();
      }
  }
  const onUnLockConfirm = async () => {
    popUpUnLock.onClose();
    handleUnLockConfirm(user._id);
  };
  const onLockConfirm = async () => {
    popUpLock.onClose();
    handleLockConfirm(user._id);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
      <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex flex-row align-items-center">
        <Link
          to={`/profile/${user._id}`}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <h5
            className="card-title"
            style={{ cursor: 'pointer', margin: 0 }}
          >
            {user.username}
          </h5>
        </Link>

        <div className="ms-3">
          <UserStatusBox status={user.status} />
        </div>
      </div>
      {user.role !== 'admin' && (
        <>
          <div className="d-flex">
           { user.status != "locked" && <div className="me-2">
            <Stack direction='horizontal' gap={3} className="mb-4 max-width-500 mx-auto" style={{ justifyContent: "center" }}>
                        <p className = "d-flex justify-content-center">{userStatus.Name}</p>
                        <CustomTooltip text={user.status == "active" ? "Deactive" : "Activate"}>
                            <Form >
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    checked={userStatus.Value == "active" ? true : false}
                                    onClick={() => popUpActive.setTrue()}
                                />
                            </Form>
                        </CustomTooltip>
                        <PopUpBase
                            {...popUpActive}
                            onConfirm={onChangeStatus}
                            title="Unlock User Confirmation"
                            desc={`Are you sure you want to unlock the user ${user.username}?`}
                        />
                </Stack>

            </div> }
            <div>
              {user.status === 'locked' ? (
                <>
                  <CustomToolTip text="Unlock user" position={'top'}>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={handleClockClick}
                    >
                      <FaLock color="inherit" size={14} />
                    </button>
                  </CustomToolTip>
                  <PopUpBase
                    {...popUpUnLock}
                    onConfirm={onUnLockConfirm}
                    title="Unlock User Confirmation"
                    desc={`Are you sure you want to unlock the user ${user.username}?`}
                  />
                </>
              ) : (
                <>
                  <CustomToolTip text="Lock user" position={'top'}>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleClockClick}
                      data-tip="Lock User"
                    >
                      <FaUnlock color="inherit" size={14} />
                    </button>
                  </CustomToolTip>
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
        </>
      )}
    </div>
        <hr />
        <div className="d-flex flex-row">
          <p className="card-text me-3 mb-0">
            <strong className="text-muted">{`Email: ${user.email}`}</strong>
          </p>

          <p className="card-text me-3 mb-0">
            <strong className="text-muted">
              {`Role: ${getUserRoleName(user.role)}`}
            </strong>
          </p>
        </div>

        <div className="d-flex flex-row">
          <p className="card-text me-3 mb-0">
            <small className="text-muted">
              {`Created At: ${moment(user.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              )}`}
            </small>
          </p>
          <p className="card-text mb-0">
            <small className="text-muted">
              {`Updated At: ${moment(user.updatedAt).format(
                "YYYY-MM-DD HH:mm:ss"
              )}`}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

UserItem.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    updatedAt: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  handleLockConfirm: PropTypes.func.isRequired,
  handleUnLockConfirm: PropTypes.func.isRequired,
};

export const userStatuses = [
  {
    Id: 1,
    Value: "active",
    Name: "Active",
    bgColor: "#C8E6C9",
    color: "green",
  },
  {
    Id: 2,
    Value: "inactive",
    Name: "Inactive",
    bgColor: "#F5F5F5",
    color: "grey",
  },
  { Id: 3, Value: "locked", Name: "Locked", bgColor: "#FF0000", color: "black" },
];

export const userRoles = [
  { Id: 1, Value: "user", Name: "User" },
  { Id: 2, Value: "admin", Name: "Admin" },
];

export const UserStatusBox = ({ status }) => {
  const userStatus = userStatuses.find((item) => item.Value === status);

  return (
    <div
      className="px-2 py-1 rounded"
      style={{ backgroundColor: userStatus?.bgColor }}
    >
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
      <Stack direction='' gap={3}>
          <p>{userStatus.Name}</p>
      </Stack>
  );
};