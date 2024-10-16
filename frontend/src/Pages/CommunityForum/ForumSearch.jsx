import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from "../../components/CircularProgress";
import Post from './components/Post';
import NoData from "../Admin/components/NoData";
import { baseUrl } from '../../config';

function SearchFilter() {
    const { register, handleSubmit } = useForm({});
    const navigate = useNavigate();
    const location = useLocation();
    const [filtered, setFiltered] = useState([]);
    const [length, setLength] = useState(0);
    const [skip, setSkip] = useState(0);

    const [searchParams] = useSearchParams();
    const title = searchParams.get('title');
    const keyword = searchParams.get('keyword');
    const sort = searchParams.get('sort');

    const conParams = () => {
        let paramString = '?'

        if (title) {
            paramString += `title=${title}&`;
        }

        if (keyword) {
            paramString += `keyword=${keyword}&`;
        }

        if (sort) {
            paramString += `sort=${sort}`;
        }

        return paramString;
    };

    const paramExists = () => {
        return title || keyword || sort;
    }

    const searchPost = async (clearedF, clearedS) => {
        try {
            const response = await fetch(`${baseUrl}/api/forum/search${conParams()}`, {
                headers: {
                    'skip': clearedS !== undefined ? clearedS : skip,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to find post');
            }

            const data = await response.json();
            
            setFiltered([...(clearedF || filtered), ...data.posts]);
            setSkip((clearedS !== undefined ? clearedS : skip) + data.posts.length);
            setLength(data.length);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setFiltered([]);
        setSkip(0);

        searchPost([], 0);
    }, [location, title, keyword, sort])

    function onSubmit(data) {
        let url = '?';
        if (data.title) {
            url += `title=${data.title}&`;
        }

        if (data.keywords) {
            url += `keyword=${data.keywords}&`;
        }
        
        url += `sort=${data.sort || -1}&`;

        url = url.endsWith('&') || url.endsWith('?') ? url.slice(0, -1) : url;

        navigate(url);
    }

    return (
        <>
            <div className="mt-3 d-flex flex-column align-items-center container-xl">
                <form className={`col-6 ${paramExists() ? 'd-none' : 'd-flex'} flex-column align-items-end gap-3`} onSubmit={handleSubmit(onSubmit)}>
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
                        <label htmlFor="keywordsInput" className="form-label">Keywords</label>
                        <input
                            type="text"
                            className='form-control'
                            id="keywordsInput"
                            aria-describedby="keywordsInput"
                            placeholder="Enter your keywords"
                            {...register("keywords")}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="sortInput" className="form-label">Sort options</label>
                        <select 
                            className='form-select'
                            id='sortInput'
                            aria-describedby="sortInput"
                            {...register("sort")}
                        >
                            <option value='-1'>Newest to Oldest</option>
                            <option value='1'>Oldest to Newest</option>
                        </select>
                    </div>
                    <button type='submit' className='rounded-5 btn btn-primary'>
                        Search
                    </button>
                </form>


            </div>
            {paramExists() && (filtered.length > 0 ?
                <InfiniteScroll
                    className={`container-xl d-flex flex-column align-items-center overflow-hidden gap-3 pt-2`}
                    dataLength={filtered.length}
                    next={searchPost}
                    hasMore={filtered.length < length}
                    loader={<CircularProgress />}
                >
                    {paramExists() && filtered.map(post => {
                        return <Post key={post._id} post={post} />
                    })}
                </InfiniteScroll>
                :
                <NoData>No Data</NoData>
            )}
        </>
    );
}

export default SearchFilter;