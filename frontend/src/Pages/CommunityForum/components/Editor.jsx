import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Swiper, SwiperSlide } from "swiper/react";
import { createTopic, replyTopic, edit } from "./ApiCalls.jsx";
import { useNavigate } from "react-router-dom";

import { pushError } from "../../../components/Toast";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";

const MyEditor = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
    reset,
  } = useForm({});
  const { status, post } = props;
  const inputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();

  const title = watch("title");
  const content = watch("content");

  const handleDelete = (image) => {
    const newImages = selectedImages.filter(
      (selectedImage) => selectedImage !== image
    );
    setSelectedImages(newImages);
  };

  const onSubmit = () => {
    if (status === "post") {
      createTopic(title, content, selectedImages, navigate);
    } else if (status === "reply") {
      replyTopic(content, selectedImages, navigate);
    } else if (status === "edit") {
      edit(title, content, selectedImages, navigate);
    }
  };

  const readImages = (e) => {
    const files = e.target.files;

    if (files.length + selectedImages.length > 5) {
      return;
    }

    const images = [...selectedImages];

    for (let i = 0; i < files.length; i++) {
      const fileSizeInMB = files[i].size / (1024 * 1024);

      if (fileSizeInMB > 1) {
        pushError("Image file is too large!");
        continue;
      }

      images.push(files[i]);
    }

    setSelectedImages(images);
    e.target.value = null;
  };

  return (
    <div
      className="modal fade"
      id={`${status}Modal`}
      tabIndex="-1"
      aria-labelledby={`${status}ModalLabel`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${status}ModalLabel`}>
              {status === "post"
                ? "New Post"
                : status === "reply"
                ? "Replying"
                : "Editing post"}
            </h5>
            <button
              type="button"
              className="btn-close"
              id={`${status}ModalClose`}
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                reset({
                  title: "",
                  content: "",
                });
                inputRef.current.value = null;
                setSelectedImages([]);
              }}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {(status === "post" ||
                (status === "edit" && post && post.parentId === null)) && (
                <>
                  <input
                    className={`form-control mb-1 ${
                      errors.title ? "is-invalid" : ""
                    }${dirtyFields.title && !errors.title ? "is-valid" : ""}`}
                    placeholder="Title of topic here..."
                    {...register("title", {
                      required: "Title cannot be empty.",
                    })}
                  />
                  {errors.title && (
                    <div className="invalid-feedback mb-1">
                      {errors.title.message}
                    </div>
                  )}
                </>
              )}
              <div className="border-2 border rounded-3 mb-2">
                <textarea
                  className="form-control mb-2 border-0 mb-3"
                  placeholder="What are you thinking about?"
                  {...register("content", {
                    required: "Content cannot be empty.",
                  })}
                ></textarea>
                {errors.content && (
                  <div className="d-block invalid-feedback mb-1">
                    {errors.content.message}
                  </div>
                )}
                {selectedImages.length > 0 && (
                  <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    navigation={{
                      nextEl: ".image-swiper-button-next",
                      prevEl: ".image-swiper-button-prev",
                      disabledClass: "swiper-button-disabled",
                    }}
                    modules={[Navigation]}
                    className="mySwiper"
                    rewind={true}
                    autoHeight={true}
                  >
                    {selectedImages.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`image-${index}`}
                          className="object-fit-contain img-fluid"
                        />
                        <button
                          onClick={() => handleDelete(image)}
                          className="ctm-btn rounded-5 position-absolute top-0 end-0 btn-index"
                        >
                          <i className="fa-solid fa-trash p-2 text-prime" />
                        </button>
                      </SwiperSlide>
                    ))}
                    <button
                      type="button"
                      className="ctm-btn swiper-button image-swiper-button-prev position-absolute btn-index top-50 start-0"
                    >
                      <i className="fa-solid fa-arrow-left text-prime p-2 fs-4" />
                    </button>
                    <button
                      type="button"
                      className="ctm-btn swiper-button image-swiper-button-next position-absolute btn-index top-50 end-0"
                    >
                      <i className="fa-solid fa-arrow-right text-prime p-2 fs-4" />
                    </button>
                  </Swiper>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center rounded-3 border p-1">
                <span className="ms-3">Add images to your post</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="d-none"
                  onChange={readImages}
                  ref={inputRef}
                  disabled={selectedImages.length >= 5}
                />
                <button
                  type="button"
                  className="ctm-btn rounded-5 me-3"
                  onClick={() => inputRef.current.click()}
                  disabled={selectedImages.length >= 5}
                >
                  <i className="fa-solid fa-image p-2" />
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <input
                type="submit"
                className="btn btn-primary col-12 rounded-3 p-1 mx-auto"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyEditor;
