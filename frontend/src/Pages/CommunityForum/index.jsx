import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Editor from "./components/Editor";
import formatDate from './components/DateFormat';
import { useUser } from "../../utils/UserContext";

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

function CommunityForum() {
    const editorRef = useRef(null);
    const { user } = useUser();
    const nav = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");

    const handleChildChange = (title, category) => {
        setTitle(title);
        setCategory(category);
    };

    const emptyArray = categories.reduce((acc, category) => {
        acc[category.bg] = [];
        return acc;
    }, {});

    const [posts, setPosts] = useState(emptyArray);

    async function createTopic() {
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            const token = localStorage.getItem('accessToken');

            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        title: title,
                        category: category,
                        content: content,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                nav(`/forum/p/${data.postId}`) // navigate to post
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum`);
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    return <>
        {user ? (
            <div className='col-10 pt-5 d-flex justify-content-end'>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#postModal">
                    <i className="fa-regular fa-plus pe-1"></i>
                    <span>Create Topic</span>
                </button>
            </div>
        ) : <></>}

        <Editor
            create={true}
            onValueChange={handleChildChange}
            func={createTopic}
            ref={editorRef}
        />

        <div className='container-lg pt-5 d-flex justify-content-center'>
            <table className='col-10'>
                <thead>
                    <tr>
                        <th className='ps-2'>Category</th>
                        <th className='ps-5'>Latest</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={index} className='category'>
                            <td className={`bd-${category.bg} col-5 align-top pt-3`}>
                                <div>
                                    <h5 className='ms-3'>
                                        <Link to={`/forum/c/${category.bg}`} className="text-reset">
                                            {category.name}
                                        </Link>
                                    </h5>
                                    <p className='ms-3'>
                                        {category.description}
                                    </p>
                                </div>
                            </td>
                            <td className='d-inline-block'>
                                {posts[category.bg].map((post, catIndex) => (
                                    <div key={catIndex} className={`mt-1 ps-5 pt-1 align-top${catIndex === (posts[category.bg].length - 1) ? ' pb-2' : ''}`}>
                                        <div className="d-inline-block pe-1">
                                            <i title='This topic is closed, it no longer accepts new replies' className={`${post.locked ? "d-inline-block" : "d-none"} pe-1 fa-solid fa-lock`}></i>
                                            <i title='This topic is pinned for you, it will display at the top of this category' className={`${post.pinned ? "d-inline-block" : "d-none"} fa-solid fa-thumbtack`}></i>
                                        </div>
                                        <Link to={`/forum/p/${post._id}`} className="category-links text-truncate pe-1">
                                            {post.title}
                                        </Link>
                                        <span className="category-date">
                                            {formatDate(new Date(post.createdAt))}
                                        </span>
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>;
};

export default CommunityForum;