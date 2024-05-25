import PopUpBase from '../../../components/pop-up/PopUpBase'
import { useRef, useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import { createTopic, replyTopic, edit, populateImages } from './ApiCalls.jsx';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { LuMousePointerClick } from "react-icons/lu";

import { pushError } from '../../../components/Toast';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';

export default function PopupEditor(props) {
   const { status, modalTitle, post, setPost } = props;

   const { register, handleSubmit, reset, formState: { errors, dirtyFields, isSubmitting } } = useForm({});

   const inputRef = useRef(null);
   const isPopulated = useRef(false);

   const [selectedImages, setSelectedImages] = useState([]);

   const nav = useNavigate();

   const handleDelete = (image) => {
      const newImages = selectedImages.filter(selectedImage => selectedImage !== image);
      setSelectedImages(newImages);
   }

   const detectImageChanges = (array1, array2) => {
      if (array1.length !== array2.length) {
         return true;
      }

      for (let i = 0; i < array1.length; i++) {
         if (array1[i] !== array2[i]) {
            return true;
         }
      }

      return false
   }

   function closePopup() {
      props.onClose();
      inputRef.current.value = null
      isPopulated.current = false;
      setSelectedImages([])
   }

   const onSubmit = (data) => {
      const { title, content } = data;

      if (status === 'post') {
         createTopic(title, content, selectedImages, nav, closePopup);
      } else if (status === 'reply') {
         replyTopic(post._id, content, selectedImages, setPost, nav, closePopup);
      } else if (status === 'edit') {
         if (post.title !== title || post.content !== content || detectImageChanges(post.images, selectedImages)) {
            const newImages = selectedImages
               .filter((image) => !post.images.map((img) => img.id).includes(image.id))
               .map((image) => image.blob);

            const modifiedSelected = selectedImages.map((img) => img.id)
            const removedImages = post.images
               .filter((image) => !modifiedSelected.includes(image.id))
               .map((image) => image.id);

            edit(post._id, title, content, newImages, removedImages, setPost, nav, closePopup);
         } else {
            pushError('No changes detected!');
         }
      }
   }

   const readImages = (e) => {
      const files = e.target.files;

      if (files.length + selectedImages.length > 5) {
         pushError('You can only upload up to 5 images!');
         return;
      }

      const images = [...selectedImages];

      for (let i = 0; i < files.length; i++) {
         const fileSizeInMB = files[i].size / (1024 * 1024);

         if (fileSizeInMB > 1) {
            pushError('Image file is too large!');
            continue;
         }

         images.push(files[i]);
      }

      setSelectedImages(images);
      e.target.value = null;
   }

   const onDrop = useCallback(acceptedFiles => {
      readImages({ target: { files: acceptedFiles } })
   }, [selectedImages])

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop, noClick: true,
      accept: {
         'image/jpeg': [],
         'image/png': []
      }, maxFiles: 5 - selectedImages.length
   })

   useEffect(() => {
      if (!isPopulated.current && status === 'edit' && post.images && post.images.length > 0) {
         populateImages(post.images).then((images) => {
            setSelectedImages([...selectedImages, ...images]);
         });
         isPopulated.current = true;
      }

      reset({
         title: status === 'edit' ? post.title : '',
         content: status === 'edit' ? post.content : '',
      })
   }, [props.open])

   return (
      <PopUpBase
         open={props.open}
         onClose={closePopup}
         title={modalTitle}
         hideClose
         hideConfirm
         desc={<>
            <form {...getRootProps()} onSubmit={handleSubmit(onSubmit)}>
               <div>
                  {(status === 'post' || (status === 'edit' && post?.parentId === null)) && <>
                     <input
                        className={`form-control mb-1 ${errors.title ? 'is-invalid' : ''}${dirtyFields.title && !errors.title ? 'is-valid' : ''}`}
                        placeholder="Title of topic here..."
                        {...register("title", {
                           required: "Title cannot be empty.",
                        })}
                     />
                     {errors.title && <div className="invalid-feedback mb-1">{errors.title.message}</div>}
                  </>}
                  <div className='border-2 border rounded-3 mb-2'>
                     <textarea
                        className='form-control mb-2 border-0 mb-3'
                        placeholder='What are you thinking about?'
                        {...register('content', {
                           required: 'Content cannot be empty.'
                        })}
                     >
                     </textarea>
                     {errors.content && <div className="d-block invalid-feedback mb-1">{errors.content.message}</div>}
                     {selectedImages.length > 0 &&
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
                           className="mySwiper"
                           rewind={true}
                        >
                           {selectedImages.map((image, index) => (
                              <SwiperSlide key={index}>
                                 <img src={image instanceof Blob ? URL.createObjectURL(image) : URL.createObjectURL(image.blob)} alt={`image-${index}`} className='object-fit-cover img-fluid' />
                                 <button type='button' onClick={() => handleDelete(image)} className='ctm-btn rounded-5 position-absolute top-0 end-0 btn-index'>
                                    <i className="fa-solid fa-trash p-2 text-prime" />
                                 </button>
                              </SwiperSlide>
                           ))}
                           <button type='button' className="ctm-btn swiper-button image-swiper-button-prev position-absolute btn-index top-50 start-0">
                              <i className="fa-solid fa-arrow-left text-prime p-2 fs-4" />
                           </button>
                           <button type='button' className="ctm-btn swiper-button image-swiper-button-next position-absolute btn-index top-50 end-0">
                              <i className="fa-solid fa-arrow-right text-prime p-2 fs-4" />
                           </button>
                        </Swiper>
                     }
                  </div>
                  <div className='d-flex justify-content-between align-items-center rounded-3 border p-1'>
                     <span className='ms-3'>{isDragActive ? 'Drop images here' : 'Drag or add images here'}
                        {isDragActive && <LuMousePointerClick className='pe-2' />}
                     </span>
                     <input
                        type="file"
                        accept="image/*"
                        multiple
                        className='d-none'
                        onChange={readImages}
                        {...getInputProps()}
                        ref={inputRef}
                        disabled={selectedImages.length >= 5}
                     />
                     <button
                        type='button'
                        className={`${selectedImages.length >= 5 ? '' : 'ctm-btn'} rounded-5 me-3`}
                        onClick={() => inputRef.current.click()}
                        disabled={selectedImages.length >= 5}
                     >
                        <i className="fa-solid fa-image p-2" />
                     </button>
                  </div>
               </div>
               <input type='submit' disabled={isSubmitting} className="btn btn-primary col-12 rounded-3 mt-3 p-1 mx-auto" />
            </form>
         </>}
      />
   )
}
