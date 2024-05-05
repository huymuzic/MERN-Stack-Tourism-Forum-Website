import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import { FaLock, FaUnlock } from "react-icons/fa";

export default function UserItem({ user }) {
    const handleButtonClick = () => {
        // Implement the action based on user's status
        if (user.status === "inactive") {
            // Handle Unlock action
        } else {
            // Handle Lock action
        }
    };
    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-row align-items-center">
                        <Link to={`users/${user.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "flex-end" }}>
                            <h5 className="card-title" style={{ cursor: "pointer", margin: 0 }}>
                                {user.username}
                            </h5>
                        </Link>

                        <div className="ms-3">
                            <UserStatusBox status={user.status} />
                        </div>
                    </div>
                    <div>
                        {user.status === "inactive" ? (
                            <button className="btn btn-sm btn-outline-warning" onClick={handleButtonClick}>
                                <FaUnlock color="inherit" size={14} />
                            </button>
                        ) : (
                            <button className="btn btn-sm btn-outline-danger" onClick={handleButtonClick}>
                                <FaLock color="inherit" size={14} />
                            </button>
                        )}
                    </div>
                </div>
                <hr />
                <div className="d-flex flex-row">
                    <p className="card-text me-3 mb-0">
                        <strong className="text-muted">
                            {`Email: ${user.email}`}
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
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        createdAt: PropTypes.instanceOf(Date).isRequired,
        updatedAt: PropTypes.instanceOf(Date).isRequired,
    }).isRequired,
};


export const userStatuses = [
    { Value: "active", Name: "Active", bgColor: "#C8E6C9", color: "green" },
    { Value: "inactive", Name: "Inactive", bgColor: "#F5F5F5", color: "grey" }
];


export const UserStatusBox = ({ status }) => {
    const userStatus = userStatuses.find((item) => item.Value === status);

    return (
        <div className="px-2 py-1 rounded" style={{ backgroundColor: userStatus?.bgColor }}>
            <p style={{ color: userStatus?.color, margin: 0 }}>{userStatus?.Name}</p>
        </div>
    );
};

UserStatusBox.propTypes = {
    status: PropTypes.string.isRequired,
};