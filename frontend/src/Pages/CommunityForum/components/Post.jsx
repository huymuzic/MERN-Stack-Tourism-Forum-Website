import { Link } from 'react-router-dom';
import formatDate from '../components/DateFormat.js';
import { getAvatarUrl } from '../../../utils/getAvar.js';
import { useState } from 'react';
import { baseUrl } from '../../../config/index.js';
import Interact from './Interactions.jsx';
import MyEditor from './Editor.jsx';

const Post = (props) => {
    const [post, setPost] = useState(props.post);

    return (post.status === 'unarchived' && <div className='px-3 col-md-10 col-lg-6 comment rounded-top bg-gray shadow-sm'>
        <div className="d-flex mt-3 ms-2">
            <Link className='ps-3 d-block' to={`/profile/${post.authorId && post.authorId._id}`}>
                <img height='45' width='45'
                    className='rounded-5'
                    alt='profile picture'
                    src={post.authorId ? getAvatarUrl(post.authorId.avatar, baseUrl) : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}>
                </img>
            </Link>

            <div className="d-flex flex-column">
                {post.authorId ? (
                    <>
                        <div className="d-flex">
                            <strong className='ms-2'>{post.authorId.username}</strong>
                            <span className={`${post.authorId.role === 'admin' ? 'd-inline-block' : 'd-none'} ps-1`}>
                                <i className="fa-solid fa-shield-halved"></i>
                            </span>
                            <strong className="ps-2 mb-auto">·</strong>
                            <p className='ps-2 mb-auto'>{formatDate(new Date(post.createdAt))}</p>
                        </div>
                        <p className='ms-2 mb-1'>@{post.authorId.username}</p>
                    </>
                ) : (<></>)}
            </div>
        </div>

        <Link to={`/forum/p/${post._id}`} name='content-area' className='text-reset'>
            <div name='title' className="col-11 mx-auto">
                <h5>{post.title}</h5>
            </div>

            <div name='content' className="col-11 mx-auto overflow-hidden pre-wrap" style={{ maxHeight: '150px' }}>
                {post.content}
            </div>
        </Link>

        <Interact
            post={post}
            setPost={setPost}
        />
    </div>
    )
};

export default Post;