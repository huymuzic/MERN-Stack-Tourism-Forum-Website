import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import formatDate from './components/DateFormat';
import { useUser } from '../../utils/UserContext';
import Editor from "./components/Editor";
import Reply from "./components/Reply";
import { Link } from 'react-router-dom';

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

function Post() {
    const { id } = useParams();

    const [post, setPost] = useState([]);
    const [target, setTarget] = useState([]);
    const [activePost, setActivePost] = useState([]);
    const [path, setPath] = useState([]);

    const nav = useNavigate();
    const { user, setUser } = useUser();

    const editorRef = useRef(null);

    function findPath(root, target, path) {
        const tempPath = path || []

        if (target.parentId !== null) {
            tempPath.unshift(target)
            findPath(root, target.parentId, tempPath)
        } else {
            setPath(path)
        }
    }

    async function replyTopic(postId) {
        const content = editorRef.current.getContent();
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum/p/${postId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    content: content,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to like post');
            }

            const responseBody = await response.json();
            setPost(responseBody.post);
            setUser(responseBody.user);

            document.getElementById("modalClose").click();
        } catch (error) {
            console.error(error);
        }
    }

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

    function renderReplies() {
        if (post._id === target._id && post.childrenIds) {
            return <>
                {post.childrenIds.map(child => (
                    <Reply
                        child={child}
                        index={child._id}
                        handleLike={handleLike}
                        setActivePost={setActivePost}
                        post={post}
                    />
                ))}
            </>
        } else {
            return <>
                {path.length > 0 && path.map(child => (
                    <>
                        <Reply
                            child={child}
                            index={child._id}
                            handleLike={handleLike}
                            setActivePost={setActivePost}
                            post={post}
                        />
                        {target.childrenIds.map(child => (
                            <Reply
                                child={child}
                                index={child._id}
                                handleLike={handleLike}
                                setActivePost={setActivePost}
                                post={post}
                            />
                        ))}
                    </>
                ))}
            </>
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum/p/${id}`);
                const data = await response.json();

                setPost(data.root);
                setTarget(data.post);
                findPath(data.root, data.post)
            } catch (error) {
                nav('/forum')
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [id]);
    return (
        <article className='container-xxl d-flex align-items-center flex-column'>
            <div className='col-7 d-flex align-items-center'>
                <Link to={post.parentId == null ? '/forum' : `/forum/p/${post.parentId._id}`} type="button" className="border-0 rounded-5 text-reset align-self-start">
                    <i className="m-3 fa-solid fa-arrow-left"></i>
                </Link>
                <h5>Post details</h5>
            </div>

            {post ? (
                <>
                    <div className='col-7 d-flex border-2 border-bottom pb-3'>
                        <div name='content-area' className='container-xxl d-inline-block'>
                            <div className="d-flex">
                                <a href='#'>
                                    <img height='45' width='45' className='rounded-5' alt='profile picture' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'>
                                    </img>
                                </a>

                                <div className='d-flex' name='heading'>
                                    <div>
                                        {post.authorId ? (
                                            <>
                                                <strong className='ms-2'>{post.authorId.username}</strong>
                                                <span className={`${post.authorId.role === 'admin' ? 'd-inline-block' : 'd-none'} ps-1`}>
                                                    <i className="fa-sharp fa-solid fa-shield-halved"></i>
                                                </span>
                                                <p className='ms-2'>@{post.authorId.username}</p>
                                            </>
                                        ) : (<></>)}
                                    </div>
                                    <strong className="ps-2 mb-auto">·</strong>
                                    <p className='ps-2 mb-auto'>{formatDate(new Date(post.createdAt))}</p>
                                </div>
                            </div>

                            <div name='content'
                                dangerouslySetInnerHTML={{ __html: post.content }}>
                            </div>

                            <div name='interaction' className='d-flex justify-content-end gap-2'>
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

                                <button
                                    data-bs-toggle="modal"
                                    data-bs-target="#postModal"
                                    className='d-flex align-items-center gap-1 rounded ctm-btn px-3 py-2'
                                    onClick={() => setActivePost(post)}
                                >
                                    <i className="fa-solid fa-share"></i>
                                    <span>Reply</span>
                                </button>

                                <button className='rounded ctm-btn px-3 py-2'>
                                    <i className="fa-solid fa-ellipsis"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {renderReplies()}
                </>
            ) : (
                <></>
            )}

            <Editor
                create={false}
                post={activePost}
                func={replyTopic}
                ref={editorRef}
            />
        </article>
    );
}

export default Post;
