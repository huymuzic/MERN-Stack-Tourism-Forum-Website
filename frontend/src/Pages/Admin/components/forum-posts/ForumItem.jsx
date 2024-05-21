import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaLock, FaUnlock } from "react-icons/fa";
import CustomToolTip from "../../../../components/CustomTooltip";
import { usePopUp } from "../../../../components/pop-up/usePopup";
import PopUpBase from "../../../../components/pop-up/PopUpBase";

const ForumItem = ({ post, handleLockConfirm, handleUnLockConfirm }) => {
  const popUpLock = usePopUp();
  const popUpUnLock = usePopUp();
  const truncatedContent =
    post.content.length > 200
      ? post.content.substring(0, 200) + "..."
      : post.content;

  const handleButtonClick = () => {
    if (post.status === "archived") {
      popUpLock.setTrue();
    }
    if (post.status === "unarchived") {
      popUpUnLock.setTrue();
    }
  };
  const onLockConfirm = async () => {
    popUpLock.onClose();
    handleUnLockConfirm(post._id);
  };

  const onUnLockConfirm = async () => {
    popUpUnLock.onClose();
    handleLockConfirm(post._id);
  };
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Link
              to={`/forum/p/${post._id}`}
              style={{ textDecoration: "none" }}
            >
              <h5 className="card-title">{post.title || "No title"}</h5>
            </Link>
            <div className="d-flex flex-row align-items-center">
              <div>
                <p className="card-text me-3 mb-0">
                  <strong className="text-muted">
                    Author: {post.authorId?.username || "User"}{" "}
                  </strong>
                </p>
                <p className="card-text mb-0">
                  <small className="text-muted">
                    Posted:{" "}
                    {moment(post.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </small>
                </p>
                <p className="card-text mb-0">
                  <small className="text-muted">
                    Deleted:{" "}
                    {moment(post.deletedAt).format("YYYY-MM-DD HH:mm:ss")}
                  </small>
                </p>
              </div>
              <div className="ms-3">
                <PostStatusBox status={post.status} />
              </div>
            </div>
          </div>
          {
            <div>
              {post.status !== "deleted" &&
                (post.status === "unarchived" ? (
                  <>
                    <CustomToolTip text="Hide post" position={"top"}>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={handleButtonClick}
                      >
                        <FaUnlock color="inherit" size={14} />
                      </button>
                    </CustomToolTip>
                    <PopUpBase
                      {...popUpUnLock}
                      onConfirm={onUnLockConfirm}
                      title="Hide post Confirmation"
                      desc={`Are you sure you want to hide this post?`}
                    />
                  </>
                ) : (
                  <>
                    <CustomToolTip text="Unhide post" position={"top"}>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleButtonClick}
                        data-tip="Lock User"
                      >
                        <FaLock color="inherit" size={14} />
                      </button>
                    </CustomToolTip>
                    <PopUpBase
                      {...popUpLock}
                      onConfirm={onLockConfirm}
                      title="Unhide post Confirmation"
                      desc={`Are you sure you want to unhide this post?`}
                    />
                  </>
                ))}
            </div>
          }
        </div>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: truncatedContent }}></div>
        {post.content.length > 200 && (
          <Link to={`/post/${post._id}`}>Read More...</Link>
        )}
      </div>
    </div>
  );
};

ForumItem.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.shape({
      username: PropTypes.string,
    }),
  }).isRequired,
};

export default ForumItem;

export const postStatuses = [
  {
    Id: 1,
    Value: "unarchived",
    Name: "Active",
    bgColor: "#C8E6C9",
    color: "green",
  },
  {
    Id: 2,
    Value: "archived",
    Name: "Inactive",
    bgColor: "#F5F5F5",
    color: "grey",
  },
  {
    Id: 3,
    Value: "deleted",
    Name: "Deleted",
    bgColor: "#DC143C",
    color: "red",
  },
];

export const PostStatusBox = ({ status }) => {
  const postStatus = postStatuses.find((item) => item.Value === status);

  return (
    <div
      className="px-2 py-1 rounded"
      style={{ backgroundColor: postStatus?.bgColor }}
    >
      <p style={{ color: postStatus?.color, margin: 0 }}>{postStatus?.Name}</p>
    </div>
  );
};
PostStatusBox.propTypes = {
  status: PropTypes.string.isRequired,
};
