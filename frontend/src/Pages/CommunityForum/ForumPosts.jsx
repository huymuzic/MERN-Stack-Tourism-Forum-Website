import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import formatDate from './components/DateFormat';
import Reply from "./components/Reply";
import { Link } from 'react-router-dom';
import CircularProgress from "../../components/CircularProgress";
import { getAvatarUrl } from '../../utils/getAvar.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { populateImages } from './components/ApiCalls.jsx';
import Interact from './components/Interactions.jsx';

import { Navigation } from 'swiper/modules';
import { baseUrl } from '../../config/index.js';

function Post() {
   const { id } = useParams();

   const [post, setPost] = useState([]);
   const [target, setTarget] = useState([]);
   const [path, setPath] = useState([]);
   const [vrHeight, setVrHeight] = useState('0%');

   const outerDivRef = useRef(null);

   const nav = useNavigate();

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
                     direct={true}
                     threaded={child !== target}
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
            const response = await fetch(`${baseUrl}/api/forum/p/${id}`);
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

   useEffect(() => {
      const updateHeight = () => {
         if (outerDivRef.current) {
            const height = window.getComputedStyle(outerDivRef.current).height;
            setVrHeight(height);
         }
      };

      if (post._id !== target._id && outerDivRef.current) {
         window.addEventListener('resize', updateHeight);
         updateHeight();
      }

      return () => window.removeEventListener('resize', updateHeight);
   }, [post, target, outerDivRef]);

   return (
      <article className='d-flex align-items-center flex-column'>
         <div className='col-lg-8 col-md-10 col-sm-12 col-12 col-sm-12 d-flex align-items-center'>
            <button type="button" className="border-0 rounded-5 text-reset" onClick={() => nav(-1)}>
               <i className="m-3 fa-solid fa-arrow-left"></i>
            </button>
            <h5>Post details</h5>
         </div>

         {post ? (
            <>
               <div ref={outerDivRef} className={`col-lg-8 col-md-10 col-sm-12 col-12 d-flex border-2 ${target._id === post._id && 'border-bottom'} pb-3`}>
                  <div name='content-area' className='container-xxl d-inline-block'>
                     <div className="d-flex">
                        <Link className='pfp-index' to={`/profile/${post.authorId && post.authorId._id}`} style={{ height: '0%', width: '45px' }}>
                           <img height='45' width='45'
                              className='rounded-5'
                              alt='profile picture'
                              src={post.authorId ? getAvatarUrl(post.authorId.avatar, baseUrl) : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}>
                           </img>
                        </Link>

                        {post._id !== target._id &&
                           <div className='position-relative low-index'>
                              <div className='d-flex position-absolute vr' style={{ width: '3px', left: '-22px', height: vrHeight }} />
                           </div>}

                        <div className='d-flex flex-column overflow-auto flex-grow-1' name='heading'>
                           <div>
                              {post.authorId ? (
                                 <>
                                    <strong className='ms-2'>{post.authorId.username}</strong>
                                    <span className={`${post.authorId.role === 'admin' ? 'd-inline-block' : 'd-none'} ps-1`}>
                                       <i className="fa-solid fa-shield-halved"></i>
                                    </span>
                                    <strong className="ps-2 mb-auto d-inline-block">·</strong>
                                    <p className='ps-2 mb-auto d-inline-block'>{formatDate(new Date(post.createdAt))}</p>
                                    <p className='ms-2'>@{post.authorId.username}</p>
                                 </>
                              ) : (<></>)}
                           </div>

                           <div className='ms-2'>
                              <div name='title'>
                                 <h5>{post.title}</h5>
                              </div>

                              <div name='content' className='pre-wrap'>
                                 {post.content}
                              </div>

                              {post.images?.length > 0 &&
                                 <Swiper
                                    style={{ height: '400px', maxWidth: '100%' }}
                                    spaceBetween={30}
                                    centeredSlides={true}
                                    navigation={{
                                       nextEl: ".image-swiper-button-next",
                                       prevEl: ".image-swiper-button-prev",
                                       disabledClass: "swiper-button-disabled"
                                    }}
                                    modules={[Navigation]}
                                    className="mySwiper my-3"
                                    rewind={true}
                                 >
                                    {post.images.map((image, index) =>
                                       <SwiperSlide key={index}>
                                          {image.blob instanceof Blob ?
                                             <img src={URL.createObjectURL(image.blob)} alt={`image-${index}`} className='object-fit-fill rounded-2' />
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

                              <Interact
                                 post={post}
                                 setPost={setPost}
                              />
                           </div>
                        </div>

                     </div>
                  </div>
               </div>

               {renderReplies()}
            </>
         ) : (
            <></>
         )}
      </article>
   );
}

export default Post;