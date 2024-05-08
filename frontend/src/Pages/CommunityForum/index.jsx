import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Editor from "./components/Editor";
import formatDate from './components/DateFormat';
import { useUser } from "../../utils/UserContext";
import InfiniteScroll from 'react-infinite-scroll-component';
import ClipLoader from "react-spinners/ClipLoader";
import { getAvatarUrl } from '../../utils/getAvar.js';

import logo from '../../assets/images/logo.png'

const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color').trim();

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

const nav_bar = [
    {
        name: 'Home',
        to: '/',
        icon: 'fa-solid fa-house',
    },
    {
        name: 'Search',
        to: '/',
        icon: 'fa-solid fa-magnifying-glass',
    },
    {
        name: 'Forum',
        to: '/forum',
        icon: 'fa-solid fa-cart-shopping',
    },
    {
        name: 'Tours',
        to: '/tours',
        icon: 'fa-solid fa-comments',
    },
];

function CommunityForum() {
    const editorRef = useRef(null);
    const { user } = useUser();
    const nav = useNavigate();

    const [posts, setPosts] = useState([]);
    const [length, setLength] = useState(0);
    const [skip, setSkip] = useState(0);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const avatarUrl = getAvatarUrl(user?.avatar, import.meta.env.VITE_BASE_URL);

    const handleChildChange = (title, category) => {
        setTitle(title);
        setCategory(category);
    };

    async function createTopic() {
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            const token = localStorage.getItem('accessToken');

            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        title: title,
                        category: category,
                        content: content,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                nav(`/forum/p/${data.postId}`) // navigate to post
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    const fetchData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum`, {
                headers: {
                    'skip': skip,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();

            setPosts([...posts, ...data.posts]);
            setSkip(skip + data.posts.length);
            setLength(data.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return <div className='d-flex'>
        <header className="d-flex justify-content-end sticky-top vh-100 col-3">
            <nav className="d-flex flex-column col-8">
                <Link to="/">
                    <img alt='Website Logo' className="img-fluid" height='150' width='150' src={logo} />
                </Link>
                <ul className="nav d-flex flex-column mb-auto gap-2">
                    {nav_bar.map((item, index) => (
                        <li key={index} className="nav-item rounded-5 comment col-5">
                            <Link to={item.to} className="nav-link active text-reset" aria-current="page">
                                <i className={item.icon}></i>
                                <span className="ps-2">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mb-5 dropdown" bis_skin_checked="1">
                    <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={user ? avatarUrl : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                        alt="user profile picture" width="45" height="45" className="rounded-circle me-2" />
                        <strong>{user ? user.username : 'Guest'}</strong>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                        <li><a className="dropdown-item" href="#">New project...</a></li>
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Sign out</a></li>
                    </ul>
                </div>
            </nav>
        </header>

        <Editor
            create={true}
            onValueChange={handleChildChange}
            func={createTopic}
            ref={editorRef}
        />

        <main>
            <InfiniteScroll
                className='container-lg d-flex flex-column align-items-center overflow-hidden gap-3'
                dataLength={posts.length}
                next={fetchData}
                hasMore={posts.length >= length ? false : true}
                loader=
                {<ClipLoader
                    color={primaryColor}
                    loading={true}
                    size={45}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />}
            >
                {user ? (
                    <div className='container-lg d-flex justify-content-center mb-3'>
                        {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#postModal">
                    <i className="fa-regular fa-plus pe-1"></i>
                    <span>Create Topic</span>
                </button> */}
                        <div className="rounded-2 col-6 bg-gray shadow-sm" >
                            <div className="d-flex justify-content-between">
                                <img height='45' width='45' className='rounded-5' alt='profile picture' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'>
                                </img>
                                <button type="button" className='col-9 comment border-0 rounded-5 text-start' data-bs-toggle="modal" data-bs-target="#postModal">
                                    What are you thinking about?
                                </button>
                            </div>
                        </div>
                    </div>
                ) : <></>}
                {posts.map(post => {
                    return <div key={post._id} className='col-6 comment rounded-top bg-gray shadow-sm'>
                        <div className="d-flex mt-3 ms-2">
                            <a className='ps-3' href='#'>
                                <img height='45' width='45' className='rounded-5' alt='profile picture' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'>
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
                                        <p className='ms-2'>@{post.authorId.username}</p>
                                    </>
                                ) : (<></>)}
                            </div>
                        </div>

                        <Link to={`/forum/p/${post._id}`} name='content-area' className='text-reset'>
                            <div name='content' className="col-11 mx-auto"
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
                        </Link>
                    </div>
                })}
            </InfiniteScroll>
        </main>
    </div>;
};

export default CommunityForum;