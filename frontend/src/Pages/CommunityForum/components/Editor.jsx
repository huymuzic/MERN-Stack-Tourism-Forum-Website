import { useEffect, useRef, forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const categories = [
    {
        name: 'Announcement',
        description: 'This category is for site administrator to post updates to tour packages or the forum',
        bg: 'announce',
    },
    {
        name: 'Destination discussion',
        description: 'This category is for users to discuss or share opinions about destinations',
        bg: 'discuss',
    },
]

const MyEditor = forwardRef((props, editorRef) => {
    const { register, handleSubmit, watch, formState: { errors, dirtyFields } } = useForm({});

    const inputRef = useRef(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const title = watch('title');
    const category = watch('category');

    const readImages = (e) => {
        const files = e.target.files;

        if (files.length + selectedImages.length > 5) {
            //setIsDisabled(true);
            return;
        }

        const images = [...selectedImages];

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();

            reader.onloadend = function () {
                images.push(reader.result);
                if (images.length === files.length + selectedImages.length) {
                    setSelectedImages(images);
                }
                if (images.length >= 5) {
                    setIsDisabled(true);
                }
            };

            reader.readAsDataURL(files[i]);
        }
    }

    return (
        <div className="modal fade" id="postModal" tabIndex="-1" aria-labelledby="postModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="postModalLabel">{props.create ? 'New Post' : `Replying to ${props.post.authorId && props.post.authorId.username}`}</h5>
                        <button type="button" className="btn-close" id='modalClose' data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmit(() => props.func(editorRef))}>
                        <div className="modal-body">
                            {props.create ? <>
                                <input
                                    className={`form-control mb-1 ${errors.title ? 'is-invalid' : ''}${dirtyFields.title && !errors.title ? 'is-valid' : ''}`}
                                    placeholder="Title of topic here..."
                                    {...register("title", {
                                        required: "Title cannot be empty.",
                                    })}
                                />
                                {errors.title && <div className="invalid-feedback mb-1">{errors.title.message}</div>}
                                <select
                                    className={`form-control mb-1 ${errors.category ? 'is-invalid' : ''}${dirtyFields.category && !errors.category ? 'is-valid' : ''}`}
                                    defaultValue='announce'
                                    {...register("category", {
                                        required: "Category is required.",
                                    })}>
                                    <option value="Category" disabled>Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category.bg}>{category.name}</option>
                                    ))}
                                </select>
                                {errors.category && <div className="invalid-feedback mb-1">{errors.category.message}</div>}
                            </> : <></>}
                            <div className='border-2 border rounded-3 mb-2'>
                                <textarea className='form-control mb-2 border-0 mb-3' placeholder='What are you thinking about?'>

                                </textarea>
                                <div className='container'>
                                    <div className='row'>
                                        {selectedImages.length > 0 && selectedImages.map((image, index) => (
                                            <div key={index} className='col position-relative d-inline-block'>
                                                <img src={image} alt={`image-${index}`} height='100' width='100' />
                                                <button onClick={() => handleDelete(index)} className='ctm-btn px-2 py-1 rounded-5 position-absolute top-0 end-0'>X</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center rounded-3 border p-1'>
                                <span className='ms-3'>Add images to your post</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className='d-none'
                                    onChange={readImages}
                                    ref={inputRef}
                                    disabled={isDisabled}
                                />
                                <button
                                    type='button'
                                    className='ctm-btn rounded-5 me-3'
                                    onClick={() => inputRef.current.click()}
                                    disabled={isDisabled}
                                >
                                    <i className="fa-solid fa-image p-2" />
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="primary__btn col-12 rounded-3 p-1 mx-auto">Create topic</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
});

export default MyEditor;
