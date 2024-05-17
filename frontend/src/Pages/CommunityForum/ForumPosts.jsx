import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import formatDate from './components/DateFormat';
import { useUser } from '../../utils/UserContext';
import Editor from "./components/Editor";
import Reply from "./components/Reply";
import { Link } from 'react-router-dom';
import CircularProgress from "../../components/CircularProgress";
import { getAvatarUrl } from '../../utils/getAvar.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { handleLike, populateImages } from './components/ApiCalls.jsx';

import { Navigation } from 'swiper/modules';

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
    const [path, setPath] = useState([]);

    const nav = useNavigate();
    const { user } = useUser();

    function findPath(root, target, path) {
        const tempPath = path || []

        if (target.parentId !== null) {
            tempPath.unshift(target)
            findPath(root, target.parentId, tempPath)
        } else {
            setPath(path)
        }
    }

    function renderReplies() {
        if (post._id === target._id && post.childrenIds) {
            return <>
                {post.childrenIds.map(child => (
                    <Reply
                        key={child._id}
                        child={child}
                        post={post}
                    />
                ))}
            </>
        } else {
            return <>
                {path.length > 0 && path.map(child => (
                    <>
                        <Reply
                            key={child._id}
                            child={child}
                            post={post}
                        />
                        {child === target && target.childrenIds.map(childx => (
                            <Reply
                                key={childx._id}
                                child={childx}
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

                if (data.root.images && data.root.images.length > 0) {
                    populateImages(data.root.images).then((images) => {
                        data.root.images = images;
                        setPost(data.root);
                        setTarget(data.post);
                        findPath(data.root, data.post);
                    })
                } else {
                    setPost(data.root);
                    setTarget(data.post);
                    findPath(data.root, data.post);
                }


            } catch (error) {
                nav('/forum')
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [id]);
    return (
        <article className='d-flex align-items-center flex-column'>
            <div className='col-8 d-flex align-items-center'>
                <Link to={target.parentId == null ? '/forum' : `/forum/p/${target.parentId._id}`} type="button" className="border-0 rounded-5 text-reset align-self-start">
                    <i className="m-3 fa-solid fa-arrow-left"></i>
                </Link>
                <h5>Post details</h5>
            </div>

            {post ? (
                <>
                    <div className='col-8 d-flex border-2 border-bottom pb-3'>
                        <div name='content-area' className='container-xxl d-inline-block'>
                            <div className="d-flex">
                                <Link to={`/profile/${post.authorId && post.authorId._id}`}>
                                    <img height='45' width='45'
                                        className='rounded-5'
                                        alt='profile picture'
                                        src={post.authorId ? getAvatarUrl(post.authorId.avatar, import.meta.env.VITE_BASE_URL) : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}>
                                    </img>
                                </Link>

                                <div className='d-flex' name='heading'>
                                    <div>
                                        {post.authorId ? (
                                            <>
                                                <strong className='ms-2'>{post.authorId.username}</strong>
                                                <span className={`${post.authorId.role === 'admin' ? 'd-inline-block' : 'd-none'} ps-1`}>
                                                    <i className="fa-solid fa-shield-halved"></i>
                                                </span>
                                                <p className='ms-2'>@{post.authorId.username}</p>
                                            </>
                                        ) : (<></>)}
                                    </div>
                                    <strong className="ps-2 mb-auto">·</strong>
                                    <p className='ps-2 mb-auto'>{formatDate(new Date(post.createdAt))}</p>
                                </div>
                            </div>

                            <div name='title'>
                                <h5>{post.title}</h5>
                            </div>

                            <div name='content' className='pre-wrap'>
                                {post.content}
                            </div>

                            {post.images?.length > 0 &&
                                <Swiper
                                    style={{ height: '400px' }}
                                    spaceBetween={30}
                                    centeredSlides={true}
                                    navigation={{
                                        nextEl: ".image-swiper-button-next",
                                        prevEl: ".image-swiper-button-prev",
                                        disabledClass: "swiper-button-disabled"
                                    }}
                                    modules={[Navigation]}
                                    className="mySwiper my-3 w-75"
                                    rewind={true}
                                >
                                    {post.images.map((image, index) =>
                                        <SwiperSlide key={index}>
                                            {image instanceof Blob ?
                                                <img src={URL.createObjectURL(image)} alt={`image-${index}`} className='object-fit-cover img-fluid rounded-2' />
                                                : <CircularProgress />}
                                        </SwiperSlide>
                                    )}
                                    <button type='button' className="ctm-btn swiper-button image-swiper-button-prev position-absolute btn-index top-50 start-0">
                                        <i className="fa-solid fa-arrow-left text-prime p-2 fs-4" />
                                    </button>
                                    <button type='button' className="ctm-btn swiper-button image-swiper-button-next position-absolute btn-index top-50 end-0">
                                        <i className="fa-solid fa-arrow-right text-prime p-2 fs-4" />
                                    </button>
                                </Swiper>
                            }

                            <div name='interaction' className='d-flex justify-content-end gap-2'>
                                {post.likes ?
                                    <button className='d-flex align-items-center gap-3 rounded ctm-btn px-3 py-2 heart'
                                        onClick={() => handleLike(post._id)}>
                                        <span>{post.likes.length}</span>
                                        <i className={`fa-heart ${user && post.likes.includes(user._id) ? 'fa-solid' : 'fa-regular'}`}></i>
                                    </button>
                                    : <></>}

                                <div className='d-flex align-items-center gap-2 rounded px-3 py-2'>
                                    <span>{countChildren(post)}</span>
                                    <i className="fa-regular fa-comment"></i>
                                </div>

                                <button
                                    data-bs-toggle="modal"
                                    data-bs-target="#replyModal"
                                    className='d-flex align-items-center gap-1 rounded ctm-btn px-3 py-2'
                                    onClick={() => nav(`/forum/p/${post._id}`)}
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
                status='reply'
            />
        </article>
    );
}

export default Post;
