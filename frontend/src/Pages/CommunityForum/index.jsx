import { useEffect, useState, useRef } from "react";
import { useUser } from "../../utils/UserContext";
import InfiniteScroll from 'react-infinite-scroll-component';
import ClipLoader from "react-spinners/ClipLoader";
import { getAvatarUrl } from '../../utils/getAvar.js';
import Post from './components/Post';

const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color').trim();

function CommunityForum() {
    const { user } = useUser();

    const [posts, setPosts] = useState([]);
    const [length, setLength] = useState(0);
    const [skip, setSkip] = useState(0);
    const userPfp = getAvatarUrl(user?.avatar, import.meta.env.VITE_BASE_URL)

    const fetchData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum`, {
                headers: {
                    'skip': skip,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();

            setPosts([...posts, ...data.posts]);
            setSkip(skip + data.posts.length);
            setLength(data.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return <>
        <InfiniteScroll
            className='container-xl d-flex flex-column align-items-center overflow-hidden gap-3 pt-2'
            dataLength={posts.length}
            next={fetchData}
            hasMore={posts.length < length}
            loader=
            {<ClipLoader
                color={primaryColor}
                loading={true}
                size={45}
                aria-label="Loading Spinner"
                data-testid="loader"
            />}
        >
            {user ? (
                <div className="rounded-2 col-md-10 col-lg-6 bg-gray shadow-sm" >
                    <div className="d-flex p-3 gap-2">
                        <img src={user ? userPfp : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                            alt="user profile picture" width="45" height="45" className="rounded-circle ms-3" />
                        <button type="button" onClick={() => document.getElementById('createPost').click()} className='ps-3 flex-grow-1 col-9 comment border-0 rounded-5 text-start bg-body-tertiary' data-bs-toggle="modal" data-bs-target="#postModal">
                            What are you thinking about?
                        </button>
                    </div>
                </div>
            ) : <></>}

            {posts.map(post => {
                return <Post key={post._id} post={post} />
            })}
        </InfiniteScroll>
    </>
};

export default CommunityForum;