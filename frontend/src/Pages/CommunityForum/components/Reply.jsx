import formatDate from '../components/DateFormat';
import { Link } from 'react-router-dom';
import { useUser } from '../../../utils/UserContext';

function countChildren(post) {
    if (!post.childrenIds || post.childrenIds.length === 0) {
        return 0;
    }

    let count = post.childrenIds.length;
    for (let child of post.childrenIds) {
        count += countChildren(child);
    }

    return count;
}

function Reply(props) {
    const { user } = useUser();
    const { child, index, handleLike, setActivePost, post } = props;

    return (<div key={index} className='col-7 d-flex border-2 border-bottom pt-3 pb-3 comment'>
        <a className='ps-3' href='#'>
            <img height='45' width='45' className='rounded-5' alt='profile picture' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'>
            </img>
        </a>

        <Link to={`/forum/p/${child._id}`} name='content-area' className='container-xxl text-reset'>
            <div className='d-flex align-items-center' name='heading'>
                <div>
                    {child.authorId ? (
                        <>
                            <strong className='ms-2'>{child.authorId.username}</strong>
                            <span className={`${child.authorId.role === 'admin' ? 'd-inline-block' : 'd-none'} ps-1`}>
                                <i className="fa-sharp fa-solid fa-shield-halved"></i>
                            </span>
                            <strong className={`${child.authorId._id === post.authorId._id ? 'd-inline-block' : 'd-none'} ps-1 text-primary`}>
                                OP
                            </strong>
                            <p className='ms-2'>@{child.authorId.username}</p>
                        </>
                    ) : (<></>)}
                </div>

                <p className='ms-auto mb-auto'>{formatDate(new Date(child.createdAt))}</p>
            </div>

            <div name='content' className='ms-2'
                dangerouslySetInnerHTML={{ __html: child.content }}>
            </div>

            <div name='interaction' className='d-flex justify-content-end gap-2'>
                {child.likes ?
                    <button className='d-flex align-items-center gap-3 rounded ctm-btn px-3 py-2 heart'
                        onClick={() => handleLike(child._id)}>
                        <span>{child.likes.length}</span>
                        <i className={`fa-heart ${child.likes.includes(user._id) ? 'fa-solid' : 'fa-regular'}`}></i>
                    </button>
                    : <></>}

                <div className='d-flex align-items-center gap-2 rounded ctm-btn px-3 py-2'>
                    <span>{countChildren(child)}</span>
                    <i className="fa-regular fa-comment"></i>
                </div>

                <button
                    data-bs-toggle="modal"
                    data-bs-target="#postModal"
                    className='d-flex align-items-center gap-1 rounded ctm-btn px-3 py-2'
                    onClick={() => setActivePost(child)}
                >
                    <i className="fa-solid fa-share"></i>
                    <span>Reply</span>
                </button>

                <button className='rounded ctm-btn px-3 py-2'>
                    <i className="fa-solid fa-ellipsis"></i>
                </button>
            </div>
        </Link>
    </div>)
}

export default Reply;