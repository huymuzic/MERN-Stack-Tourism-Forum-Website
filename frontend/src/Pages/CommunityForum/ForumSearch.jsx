import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import ClipLoader from "react-spinners/ClipLoader";
import Post from './components/Post';

const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color').trim();

const categories = [
    { name: 'Announcement', val: 'announce', color: 'bd-announce' },
    { name: 'Discussion', val: 'discuss', color: 'bd-discuss' },
]

function SearchFilter() {
    const { register, handleSubmit } = useForm({});
    const navigate = useNavigate();
    const [filtered, setFiltered] = useState([]);
    const [length, setLength] = useState(0);
    const [skip, setSkip] = useState(0);

    const [searchParams] = useSearchParams();
    const title = searchParams.get('title');
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');

    const conParams = () => {
        let paramString = '?'

        if (title) {
            paramString += `title=${title}&`;
        }

        if (keyword) {
            paramString += `keyword=${keyword}&`;
        }

        if (category && category !== 'Select your category') {
            paramString += `category=${category}`;
        }

        return paramString;
    };

    const paramExists = () => {
        return title || keyword || (category && category !== 'Select your category');
    }

    const searchPost = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum/search${conParams()}`, {
                headers: {
                    'skip': skip,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to find post');
            }

            const data = await response.json();
            setFiltered([...filtered, ...data.posts]);
            setSkip(skip + data.posts.length);
            setLength(data.length);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        searchPost();
    }, [])

    function onSubmit(data) {
        let url = '?';
        if (data.title) {
            url += `title=${data.title}&`;
        }
        if (data.content) {
            url += `keyword=${data.content}&`;
        }
        if (data.category && data.category !== 'Select your category') {
            url += `category=${data.category}&`;
        }

        url = url.endsWith('&') || url.endsWith('?') ? url.slice(0, -1) : url;
        navigate(url);
    }

    return (
        <div className="mt-3 d-flex flex-column align-items-center container">
            <form className={`col-6 ${(filtered.length > 0 && paramExists()) ? 'd-none' : 'd-flex'} flex-column align-items-end gap-3`} onSubmit={handleSubmit(onSubmit)}>
                <div className="col-12">
                    <label htmlFor="titleInput" className="form-label">Title</label>
                    <input
                        type="text"
                        className='form-control'
                        id="titleInput"
                        aria-describedby="titleInput"
                        placeholder="Enter your title"
                        {...register("title")}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="contentInput" className="form-label">Keywords</label>
                    <input
                        type="text"
                        className='form-control'
                        id="contentInput"
                        aria-describedby="contentInput"
                        placeholder="Enter your keywords"
                        {...register("content")}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="categoryInput" className="form-label">Category</label>
                    <select
                        className='form-control'
                        defaultValue='Select your category'
                        id="categoryInput"
                        aria-describedby="categoryInput"
                        {...register("category")}>
                        <option disabled>Select your category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.val}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <button type='submit' className='rounded-5 primary__btn'>
                    Search
                </button>
            </form>

            <InfiniteScroll
                className={`container-xl ${(filtered.length > 0 && paramExists()) ? 'd-flex' : 'd-none'} flex-column align-items-center overflow-hidden gap-3 pt-2`}
                dataLength={filtered.length}
                next={searchPost}
                hasMore={filtered.length < length}
                loader=
                {<ClipLoader
                    color={primaryColor}
                    loading={true}
                    size={45}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />}
            >
                {paramExists() && filtered.map(post => {
                    return <Post key={post._id} post={post} />
                })}
            </InfiniteScroll>
        </div>
    );
}

export default SearchFilter;