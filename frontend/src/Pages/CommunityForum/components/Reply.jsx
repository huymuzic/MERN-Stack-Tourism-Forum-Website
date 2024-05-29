import formatDate from '../components/DateFormat';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../../../utils/getAvar.js';
import { populateImages } from './ApiCalls.jsx';
import CircularProgress from "../../../components/CircularProgress";
import { Swiper, SwiperSlide } from 'swiper/react';
import Interact from './Interactions.jsx';

import { Navigation } from 'swiper/modules';
import { baseUrl } from '../../../config/index.js';

function Reply(props) {
   const { post, direct, threaded } = props;
   const [child, setChild] = useState(props.child);
   const [vrHeight, setVrHeight] = useState('0px');
   const outerDivRef = useRef();

   useEffect(() => {
      if (child.images && child.images.length > 0) {
         populateImages(child.images).then((images) => {
            setChild({ ...child, images: images });
         });
      }
   }, [])

   useEffect(() => {
      const updateHeight = () => {
         if (outerDivRef.current) {
            const height = window.getComputedStyle(outerDivRef.current).height;
            setVrHeight(height);
         }
      };

      window.addEventListener('resize', updateHeight);
      updateHeight();

      return () => window.removeEventListener('resize', updateHeight);
   }, [child, outerDivRef]);

   if (child.status !== 'unarchived') {
      return;
   }

   return (
      <div ref={outerDivRef} className='col-lg-8 col-md-10 col-sm-12 col-12 d-flex border-2 border-bottom pb-3 pt-3 comment'>
         <div name='content-area' className='container-xxl d-inline-block'>
            <div className="d-flex">
               <Link className='pfp-index' to={`/profile/${child.authorId && post.authorId._id}`} style={{ height: '0%' }}>
                  <img height='45' width='45'
                     className='rounded-5'
                     alt='profile picture'
                     src={child.authorId ? getAvatarUrl(child.authorId.avatar, baseUrl) : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}>
                  </img>
               </Link>

               {direct &&
                  <div className='position-relative low-index'>
                     <div className='d-flex position-absolute vr' style={{ marginTop: '-16px', width: '3px', left: '-22px' }} />
                  </div>
               }

               {threaded &&
                  <div className='position-relative low-index'>
                     <div className='d-flex position-absolute vr' style={{ width: '3px', left: '-22px', height: vrHeight }} />
                  </div>
               }

               <div className='d-flex flex-column overflow-auto flex-grow-1' name='heading'>
                  <div>
                     {child.authorId ? (
                        <>
                           <div className='d-flex justify-content-between'>
                              <div>
                                 <strong className='ms-2' aria-label={`Posted by ${child.authorId.username}`}>{child.authorId.username}</strong>
                                 <span className={`${child.authorId.role === 'admin' ? 'd-inline-block' : 'd-none'} ps-1`}>
                                    <i className="fa-solid fa-shield-halved"></i>
                                 </span>
                                 <strong className={`${child.authorId._id === post.authorId._id ? 'd-inline-block' : 'd-none'} ps-1 text-primary`}>
                                    OP
                                 </strong>
                              </div>
                              
                              <div className='d-flex align-items-center'>
                                 <i className="fa-solid fa-share mt-2 text-secondary pe-2"></i>
                                 <img height='30' width='30'
                                    className='rounded-5'
                                    alt='profile picture'
                                    src={child.parentId && child.parentId.authorId ? getAvatarUrl(child.parentId.authorId.avatar, baseUrl) : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}>
                                 </img>
                                 <p className='m-0 text-secondary ps-2'>{child.parentId && child.parentId.authorId ? child.parentId.authorId.username : 'N/A'}</p>
                                 <strong className="ps-2 mb-auto d-inline-block ps-2">·</strong>
                                 <p className='d-inline-block ps-2 m-0'>{formatDate(new Date(child.createdAt))}</p>
                              </div>
                           </div>

                           <div>
                              <p className='ms-2'>@{child.authorId.username}</p>
                           </div>
                        </>
                     ) : (<></>)}
                  </div>

                  <div className='ms-2'>
                     <Link to={`/forum/p/${child._id}`} tabIndex={0} className='text-reset'>
                        <div name='content' className='pre-wrap'>
                           {child.content}
                        </div>

                        {child.images?.length > 0 &&
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
                              {child.images.map((image, index) =>
                                 <SwiperSlide key={index}>
                                    {image.blob instanceof Blob ?
                                       <img tabIndex={0} src={URL.createObjectURL(image.blob)} alt={`image-${index}`} width={'100%'} className='object-fit-cover rounded-2' />
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

                     <Interact
                        post={child}
                        setPost={setChild}
                     />
                  </div>
               </div>

            </div>
         </div>
      </div>
   )
}

export default Reply;