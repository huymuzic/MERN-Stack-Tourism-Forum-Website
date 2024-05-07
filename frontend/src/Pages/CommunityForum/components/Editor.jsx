import { useEffect, useRef, forwardRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
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

    const placeholderRef = useRef(props.create ? 'Title is required' : 'Start typing your post here...');
    const [isDisabled, setIsDisabled] = useState(props.create && true);
    
    const title = watch('title');
    const category = watch('category');

    useEffect(() => {
        if (props.create) {
            setIsDisabled(!title || !category);
            props.onValueChange(title, category);
    
            if (!title) {
                placeholderRef.current = 'Title is required';
            } else if (!category) {
                placeholderRef.current = 'Category is required';
            } else {
                placeholderRef.current = 'Start typing your post here...';
            }
        }

        if (editorRef.current) {
            const editorBody = editorRef.current.getBody();
            editorBody.setAttribute('data-mce-placeholder', placeholderRef.current);
        }
    }, [title, category]);

    return (
        <div className="modal fade" id="postModal" tabIndex="-1" aria-labelledby="postModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="postModalLabel">{props.create ?  'New Post' : `Replying to ${props.post.authorId && props.post.authorId.username}`}</h5>
                        <button type="button" className="btn-close" id='modalClose' data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmit(() => props.func(props.post?._id))}>
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
                            <Editor
                                disabled={isDisabled}
                                onInit={(_evt, editor) => {
                                    editorRef.current = editor;
                                    editor.getBody().setAttribute('data-mce-placeholder', placeholderRef.current);
                                }}
                                apiKey='0n955vycun65mp497j9wk7i9eh879to8zmydqbau8u5069fq'
                                init={{
                                    height: 500,
                                    menubar: false,
                                    selector: 'textarea',
                                    file_picker_types: 'image',
                                    license_key: 'gpl',
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'image'
                                    ],
                                    branding: false,
                                    setup: (editor) => {
                                        editor.on('focus', () => {
                                            editor.getBody().removeAttribute('data-mce-placeholder');
                                        });
                                        editor.on('blur', () => {
                                            if (!editor.getContent().trim()) {
                                                editor.getBody().setAttribute('data-mce-placeholder', placeholderRef.current);
                                            }
                                        });
                                    },
                                    link_assume_external_targets: true,
                                    toolbar: 'undo redo | blocks' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat image link | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    file_picker_callback: (callback, value, meta) => {
                                        if (meta.filetype === 'image') {
                                            const input = document.createElement('input');
                                            input.setAttribute('type', 'file');
                                            input.setAttribute('accept', 'image/*');

                                            input.onchange = function () {
                                                const file = input.files[0];
                                                const reader = new FileReader();

                                                reader.onload = function () {
                                                    const id = 'blobid' + (new Date()).getTime();
                                                    const blobCache = editorRef.current.editorUpload.blobCache;
                                                    const base64 = reader.result.split(',')[1];
                                                    const blobInfo = blobCache.create(id, file, base64);
                                                    blobCache.add(blobInfo);
                                                    callback(blobInfo.blobUri(), { title: file.name });
                                                };
                                                reader.readAsDataURL(file);
                                            };

                                            input.click();
                                        }
                                    },
                                }}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Discard</button>
                            <button type="submit" className="btn btn-primary">Create topic</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
});

export default MyEditor;
