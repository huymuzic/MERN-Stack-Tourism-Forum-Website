import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaLock, FaUnlock } from "react-icons/fa";
import CustomToolTip from "../../../../components/CustomTooltip";
import { usePopUp } from "../../../../components/pop-up/usePopup";
import PopUpBase from "../../../../components/pop-up/PopUpBase";
import color from "../../../../theme/Color";

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
    <div className="card mb-3" tabIndex="0" aria-label={`Forum post titled ${post.title || "No title"}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Link
              to={`/forum/p/${post._id}`}
              style={{ textDecoration: "none" }}
              tabIndex="0"
              aria-label={`View details of forum post titled ${post.title || "No title"}`}
            >
              <h5 className="card-title">{post.title || "No title"}</h5>
            </Link>
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2">
              <div>
                <p className="card-text me-3 mb-0" tabIndex="0" aria-label={`Author: ${post.authorId?.username || "User"}`}>
                  <strong className="text-muted">
                    Author: {post.authorId?.username || "User"}{" "}
                  </strong>
                </p>
                <p className="card-text mb-0" tabIndex="0" aria-label={`Posted on ${moment(post.createdAt).format("YYYY-MM-DD HH:mm:ss")}`}>
                  <small className="text-muted">
                    Posted:{" "}
                    {moment(post.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </small>
                </p>
                {post.deletedAt && (
                  <p className="card-text mb-0" tabIndex="0" aria-label={`Deleted on ${moment(post.deletedAt).format("YYYY-MM-DD HH:mm:ss")}`}>
                    <small className="text-muted">
                      Deleted:{" "}
                      {moment(post.deletedAt).format("YYYY-MM-DD HH:mm:ss")}
                    </small>
                  </p>
                )}
              </div>
              <div className="ms-3">
                <PostStatusBox status={post.status} />
              </div>
            </div>
          </div>
          <div>
            {post.status !== "deleted" &&
              (post.status === "unarchived" ? (
                <>
                  <CustomToolTip text="Hide post" position={"top"}>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={handleButtonClick}
                      aria-label="Hide post"
                      tabIndex="0"
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
                      aria-label="Unhide post"
                      tabIndex="0"
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
        </div>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: truncatedContent }} tabIndex="0" aria-label="Post content"></div>
        {post.content.length > 200 && (
          <Link to={`/post/${post._id}`} tabIndex="0" aria-label="Read more about this post">Read More...</Link>
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
    status: PropTypes.string.isRequired,
    deletedAt: PropTypes.string,
  }).isRequired,
  handleLockConfirm: PropTypes.func.isRequired,
  handleUnLockConfirm: PropTypes.func.isRequired,
};

export default ForumItem;

export const postStatuses = [
  {
    Id: 1,
    Value: "unarchived",
    Name: "Active",
    bgColor: color.successLight,
    color: color.success,
  },
  {
    Id: 2,
    Value: "archived",
    Name: "Inactive",
    bgColor: color.grey200,
    color: color.grey400,
  },
  {
    Id: 3,
    Value: "deleted",
    Name: "Deleted",
    bgColor: color.lightDanger,
    color: color.danger,
  },
];

export const PostStatusBox = ({ status }) => {
  const postStatus = postStatuses.find((item) => item.Value === status);

  return (
    <div
      className="px-2 py-1 rounded"
      style={{ backgroundColor: postStatus?.bgColor }}
      tabIndex="0"
      aria-label={`Status: ${postStatus?.Name}`}
    >
      <p style={{ color: postStatus?.color, margin: 0 }}>{postStatus?.Name}</p>
    </div>
  );
};

PostStatusBox.propTypes = {
  status: PropTypes.string.isRequired,
};
