import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import { FaLock, FaUnlock } from "react-icons/fa";
import CustomToolTip from "../../../../components/CustomTooltip";
import { usePopUp } from "../../../../components/pop-up/usePopup";
import PopUpBase from "../../../../components/pop-up/PopUpBase";

export default function UserItem({ user, handleLockConfirm, handleUnLockConfirm }) {
    const popUpLock = usePopUp();
    const popUpUnLock = usePopUp();
    const token = localStorage.getItem('accessToken');
    const handleButtonClick = () => {
        if (user.status === "inactive") {
            popUpUnLock.setTrue();

        } else {
            popUpLock.setTrue();
        }
    };

    const onLockConfirm = async () => {
        popUpLock.onClose()
        handleLockConfirm(user._id)
    };

    const onUnLockConfirm = async () => {
        popUpUnLock.onClose()
        handleUnLockConfirm(user._id)
    };
    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-row align-items-center">
                        <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", display: "flex", alignItems: "flex-end" }}>
                            <h5 className="card-title" style={{ cursor: "pointer", margin: 0 }}>
                                {user.username}
                            </h5>
                        </Link>

                        <div className="ms-3">
                            <UserStatusBox status={user.status} />
                        </div>
                    </div>
                    {
                        user.role != "admin" && <div>
                            {user.status === "inactive" ? (
                                <>
                                    <CustomToolTip text="Unlock user" position={"top"}>
                                        <button className="btn btn-sm btn-outline-warning" onClick={handleButtonClick}>
                                            <FaUnlock color="inherit" size={14} />
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
                                    <CustomToolTip text="Lock user" position={"top"}>
                                        <button className="btn btn-sm btn-outline-danger" onClick={handleButtonClick} data-tip="Lock User">
                                            <FaLock color="inherit" size={14} />
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
                    }
                </div>
                <hr />
                <div className="d-flex flex-row">
                    <p className="card-text me-3 mb-0">
                        <strong className="text-muted">
                            {`Email: ${user.email}`}
                        </strong>
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
                            {`Created At: ${moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}`}
                        </small>
                    </p>
                    <p className="card-text mb-0">
                        <small className="text-muted">
                            {`Updated At: ${moment(user.updatedAt).format("YYYY-MM-DD HH:mm:ss")}`}
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
    { Id: 1, Value: "active", Name: "Active", bgColor: "#C8E6C9", color: "green" },
    { Id: 2, Value: "inactive", Name: "Inactive", bgColor: "#F5F5F5", color: "grey" }
];

export const userRoles = [
    { Id: 1, Value: "user", Name: "User" },
    { Id: 2, Value: "admin", Name: "Admin" }
];

export const UserStatusBox = ({ status }) => {
    const userStatus = userStatuses.find((item) => item.Value === status);

    return (
        <div className="px-2 py-1 rounded" style={{ backgroundColor: userStatus?.bgColor }}>
            <p style={{ color: userStatus?.color, margin: 0 }}>{userStatus?.Name}</p>
        </div>
    );
};
const getUserRoleName = (role) => {
    const userRole = userRoles.find((item) => item.Value === role);
    return userRole ? userRole.Name : '';
};
UserStatusBox.propTypes = {
    status: PropTypes.string.isRequired,
};