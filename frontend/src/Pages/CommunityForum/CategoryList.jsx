import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import formatDate from './components/DateFormat';
import { Link } from 'react-router-dom';

function List() {
    const { category } = useParams();
    const [posts, setPosts] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum/c/${category}`);
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                nav('/forum')
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [category]);

    return <div className='container-lg pt-5 d-flex justify-content-center'>
        <table className='col-10'>
            <thead>
                <tr>
                    <th>Topic</th>
                    <th>Replies</th>
                    <th>Likes</th>
                    <th>Activity</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(posts) ? posts.map((post, index) => (
                    <tr key={post.title} className='category'>
                        <td>
                            <div className={`mt-1 pt-1 align-top${index === (posts.length - 1) ? ' pb-2' : ''}`}>
                                <div className="d-inline-block pe-1">
                                    <i title='This topic is closed, it no longer accepts new replies' className={`${post.locked ? "d-inline-block" : "d-none"} pe-1 fa-solid fa-lock`}></i>
                                    <i title='This topic is pinned for you, it will display at the top of this category' className={`${post.pinned ? "d-inline-block" : "d-none"} fa-solid fa-thumbtack`}></i>
                                </div>
                                <Link to={`/forum/p/${post._id}`} className="text-reset text-truncate pe-1">
                                    {post.title}
                                </Link>
                                <span className="category-date">
                                    {formatDate(new Date(post.createdAt))}
                                </span>
                            </div>
                        </td>

                        <td>
                            {post.childrenIds.length}
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td>No posts available</td>
                    </tr>
                )};
            </tbody>
        </table>
    </div>
}

export default List;