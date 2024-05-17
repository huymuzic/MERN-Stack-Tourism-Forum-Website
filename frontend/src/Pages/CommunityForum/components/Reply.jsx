import formatDate from '../components/DateFormat';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../../utils/UserContext';
import { getAvatarUrl } from '../../../utils/getAvar.js';
import { handleLike, populateImages } from './ApiCalls.jsx';
import { useNavigate } from 'react-router-dom';
import CircularProgress from "../../../components/CircularProgress";
import { Swiper, SwiperSlide } from 'swiper/react';

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

function Reply(props) {
    const { user } = useUser();
    const { post } = props;
    const [child, setChild] = useState(props.child);
    const nav = useNavigate();

    useEffect(() => {
        if (child.images && child.images.length > 0) {
            populateImages(child.images).then((images) => {
                setChild({ ...child, images: images });
            });
        }
    }, [])

    return (<div className='col-8 d-flex border-2 border-bottom pt-3 pb-3 comment flex-column'>
        <div className='d-flex'>
            <Link className='ps-3' to={`/profile/${child.authorId && child.authorId._id}`}>
                <img height='45' width='45' className='rounded-5' alt='profile picture'
                    src={child.authorId ? getAvatarUrl(child.authorId.avatar, import.meta.env.VITE_BASE_URL) : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}>
                </img>
            </Link>

            <div className='d-flex align-items-center' name='heading'>
                <div>
                    {child.authorId ? (
                        <>
                            <strong className='ms-2'>{child.authorId.username}</strong>
                            <span className={`${child.authorId.role === 'admin' ? 'd-inline-block' : 'd-none'} ps-1`}>
                                <i className="fa-solid fa-shield-halved"></i>
                            </span>
                            <strong className={`${child.authorId._id === post.authorId._id ? 'd-inline-block' : 'd-none'} ps-1 text-primary`}>
                                OP
                            </strong>
                            <strong className="px-2 mb-auto">·</strong>
                            <p className='ms-2'>@{child.authorId.username}</p>
                        </>
                    ) : (<></>)}
                </div>

                <p className='ms-auto mb-auto'>{formatDate(new Date(child.createdAt))}</p>
            </div>
        </div>

        <Link to={`/forum/p/${child._id}`} name='content-area' className='container-xxl text-reset'>
            <div name='content' className='pre-wrap'>
                {child.content}
            </div>

            {child.images?.length > 0 &&
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
                    {child.images.map((image, index) =>
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
        </Link>

        <div name='interaction' className='d-flex justify-content-end gap-2'>
            {child.likes ?
                <button className='d-flex align-items-center gap-3 rounded ctm-btn px-3 py-2 heart'
                    onClick={() => handleLike(child._id)}>
                    <span>{child.likes.length}</span>
                    <i className={`fa-heart ${child.likes.includes(user._id) ? 'fa-solid' : 'fa-regular'}`}></i>
                </button>
                : <></>}

            <div className='d-flex align-items-center gap-2 rounded px-3 py-2'>
                <span>{countChildren(child)}</span>
                <i className="fa-regular fa-comment"></i>
            </div>

            <button
                data-bs-toggle="modal"
                data-bs-target="#replyModal"
                className='d-flex align-items-center gap-1 rounded ctm-btn px-3 py-2'
                onClick={() => nav(`/forum/p/${child._id}`)}
            >
                <i className="fa-solid fa-share"></i>
                <span>Reply</span>
            </button>

            <button className='rounded ctm-btn px-3 py-2'>
                <i className="fa-solid fa-ellipsis"></i>
            </button>
        </div>
    </div>)
}

export default Reply;