import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

const ForumItem = ({ post }) => {
  const truncatedContent = post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
              <h5 className="card-title">{post.title || "No title"}</h5>
            </Link>
            <div className="d-flex flex-row">
              <p className="card-text me-3 mb-0">
                <strong className="text-muted">Author: {post.authorId.username}</strong>
              </p>
              <p className="card-text mb-0">
                <small className="text-muted">Posted: {moment(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}</small>
              </p>
            </div>
          </div>
        </div>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: truncatedContent }}></div>
        {
          post.content.length > 200 &&
          <Link to={`/post/${post._id}`} >
            Read More...
          </Link>
        }
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
      username: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
};

export default ForumItem;
