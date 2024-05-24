import { Link, useNavigate } from 'react-router-dom';
import formatDate from '../components/DateFormat.js';
import { getAvatarUrl } from '../../../utils/getAvar.js';
import { useUser } from '../../../utils/UserContext';
import { useState, useEffect } from 'react';
import { handleLike, handledelete } from './ApiCalls.jsx';
import { usePopUp } from "../../../components/pop-up/usePopup";
import PopUpBase from "../../../components/pop-up/PopUpBase";
import { baseUrl } from '../../../config/index.js';

function countChildren(post) {
    if (!post.childrenIds || post.childrenIds.length === 0) {
        return 0;
    }

    let count = post.childrenIds.length;
    for (let child of post.childrenIds) {
        count += countChildren(child);
    }

    return count;
}

const Post = (props) => {
    const [post, setPost] = useState(props.post);
    const { user, setUser } = useUser();
    const popUpDelete = usePopUp();
    const navigate = useNavigate();

    const onDeleteConfirm = async () => {
        popUpDelete.onClose();
        await handledelete(post._id, setPost);
    };
    return (post.status === 'unarchived' && (
        <div className='px-3 col-md-10 col-lg-6 comment rounded-top bg-gray shadow-sm'>
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

            <div name='interaction' className='d-flex justify-content-end gap-2 col-12'>
                {post.likes ?
                    <button className='d-flex align-items-center gap-3 rounded ctm-btn px-3 py-2 heart'
                        onClick={async () => {
                            await handleLike(post._id, setPost, setUser);
                        }}>
                        <span>{post.likes.length}</span>
                        <i className={`fa-heart ${user && post.likes.includes(user._id) ? 'fa-solid' : 'fa-regular'}`}></i>
                    </button>
                    : <></>}

                <div className='d-flex align-items-center gap-2 rounded px-3 py-2'>
                    <span>{countChildren(post)}</span>
                    <i className="fa-regular fa-comment"></i>
                </div>

                <button
                    data-bs-toggle='modal'
                    data-bs-target='#replyModal'
                    className='d-flex align-items-center gap-1 rounded ctm-btn px-3 py-2'
                    onClick={() => navigate(user ? `/forum/p/${post._id}` : '/login')}
                >
                    <i className="fa-solid fa-share"></i>
                    <span>Reply</span>
                </button>

                {post.authorId && user?._id === post.authorId._id && (
                    <>
                        <button className='rounded ctm-btn px-3 py-2' data-bs-toggle='dropdown'>
                            <i className="fa-solid fa-ellipsis"></i>
                        </button>

                        <ul className="dropdown-menu">
                            <li>
                                <button className="dropdown-item">
                                    <i className="fa-solid fa-pencil pe-2"></i>
                                    <span>Edit</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={() => popUpDelete.setTrue()}
                                >
                                    <i className="fa-solid fa-trash-can pe-2"></i>
                                    <span>Delete</span>
                                </button>
                            </li>
                        </ul>
                    </>
                )}
            </div>
            <PopUpBase
                {...popUpDelete}
                onConfirm={onDeleteConfirm}
                title="Delete post Confirmation"
                desc={`Are you sure you want to delete this post?`}
            />
        </div>
    ));
};

export default Post;
