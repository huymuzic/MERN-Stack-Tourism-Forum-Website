import { Link } from 'react-router-dom';
import formatDate from '../components/DateFormat.js';
import { getAvatarUrl } from '../../../utils/getAvar.js';
import { useUser } from '../../../utils/UserContext';

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

const categoryColors = {
    'announce': {
        color: 'bd-announce',
        name: 'Announcement',
    },
    'discuss': {
        color: 'bd-discuss',
        name: 'Discussion',
    },
}

function Post(props) {
    const { post } = props;
    const { user } = useUser();

    async function handleLike(postId) {
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum/p/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to like post');
            }

            const responseBody = await response.json();
            setPost(responseBody.post);
            setUser(responseBody.user);
        } catch (error) {
            console.error(error);
        }
    };
    
    return <div className='col-md-10 col-lg-6 comment rounded-top bg-gray shadow-sm'>
        <div className="d-flex mt-3 ms-2">
            <a className='ps-3 d-block'  href={`/profile/${post.authorId?._id}`}>
                <img height='45' width='45'
                    className='rounded-5'
                    alt='profile picture'
                    src={post.authorId ? getAvatarUrl(post.authorId.avatar, import.meta.env.VITE_BASE_URL) : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}>
                </img>
            </a>

            <div className="d-flex flex-column">
                {post.authorId ? (
                    <>
                        <div className="d-flex">
                            <strong className='ms-2'>{post.authorId.username}</strong>
                            <span className={`${post.authorId.role === 'admin' ? 'd-inline-block' : 'd-none'} ps-1`}>
                                <i className="fa-sharp fa-solid fa-shield-halved"></i>
                            </span>
                            <strong className="ps-2 mb-auto">·</strong>
                            <p className='ps-2 mb-auto'>{formatDate(new Date(post.createdAt))}</p>
                        </div>
                        <p className='ms-2 mb-1'>@{post.authorId.username}</p>
                    </>
                ) : (<></>)}
            </div>
        </div>

        <div className="ms-4 d-flex align-items-center gap-2 mb-2">
            <div className={`${categoryColors[post.category].color} square`} />
            <span>{categoryColors[post.category].name}</span>
        </div>

        <Link to={`/forum/p/${post._id}`} name='content-area' className='text-reset'>
            <div name='title' className="col-11 mx-auto">
                <h5>{post.title}</h5>
            </div>

            <div name='content' className="col-11 mx-auto overflow-hidden" style={{ maxHeight: '150px' }}
                dangerouslySetInnerHTML={{ __html: post.content }}>
            </div>

            <div name='interaction' className='d-flex justify-content-end gap-2 col-11 mx-auto'>
                {post.likes ?
                    <button className='d-flex align-items-center gap-3 rounded ctm-btn px-3 py-2 heart'
                        onClick={() => handleLike(post._id)}>
                        <span>{post.likes.length}</span>
                        <i className={`fa-heart ${user && post.likes.includes(user._id) ? 'fa-solid' : 'fa-regular'}`}></i>
                    </button>
                    : <></>}

                <div className='d-flex align-items-center gap-2 rounded ctm-btn px-3 py-2'>
                    <span>{countChildren(post)}</span>
                    <i className="fa-regular fa-comment"></i>
                </div>

                <button className='d-flex align-items-center gap-1 rounded ctm-btn px-3 py-2'>
                    <i className="fa-solid fa-share"></i>
                    <span>Reply</span>
                </button>

                <button className='rounded ctm-btn px-3 py-2'>
                    <i className="fa-solid fa-ellipsis"></i>
                </button>
            </div>
        </Link>
    </div>
}

export default Post;