import { handleLike, handledelete, archive } from "./ApiCalls.jsx";
import { useUser } from "../../../utils/UserContext";
import { usePopUp } from "../../../components/pop-up/usePopup";
import PopUpBase from "../../../components/pop-up/PopUpBase";
import PopupEditor from "./PopupEditor.jsx";

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

const Interact = ({ post, setPost }) => {
   const { user } = useUser();

   const popUpDelete = usePopUp();
   const popUpArchive = usePopUp();

   const popUpEdit = usePopUp();
   const popUpReply = usePopUp();

   const findOwnership = (post) => {
      if (post && post.parentId === null) {
         return post.authorId?._id === user?._id;
      }
   
      if (post && post.authorId?._id === user?._id) {
         return true;
      }
   
      return post ? findOwnership(post.parentId) : false;
   }

   const onDeleteConfirm = async () => {
      popUpDelete.onClose();
      handledelete(post._id, setPost);
   };

   const onArchiveConfirm = async () => {
      popUpArchive.onClose();
      archive(post._id, setPost);
   };

   return (
      <>
         <div name="interaction" className="d-flex justify-content-end gap-2">
            {post.likes ? (
               <button
                  className="d-flex align-items-center gap-3 rounded ctm-btn px-3 py-2 heart"
                  onClick={() => handleLike(post._id, setPost, user._id)}
               >
                  <span>{post.likes.length}</span>
                  <i
                     className={`fa-heart ${user && post.likes.includes(user._id) ? "fa-solid" : "fa-regular"}`}
                  ></i>
               </button>
            ) : (
               <></>
            )}

            <div className="d-flex align-items-center gap-2 rounded px-3 py-2">
               <span>{countChildren(post)}</span>
               <i className="fa-regular fa-comment"></i>
            </div>

            <button
               className="d-flex align-items-center gap-1 rounded ctm-btn px-3 py-2"
               onClick={popUpReply.setTrue}
            >
               <i className="fa-solid fa-share"></i>
               <span>Reply</span>
            </button>


            <button
               className="rounded ctm-btn px-3 py-2"
               data-bs-toggle="dropdown"
            >
               <i className="fa-solid fa-ellipsis"></i>
            </button>

            <ul className="dropdown-menu">
               <li>
                  <button className="dropdown-item">
                     <i className="fa-solid fa-flag pe-2"></i>
                     <span>Report</span>
                  </button>
               </li>
               {user && post.authorId && user?._id === post.authorId._id && (
                  <li>
                     <button
                        className="dropdown-item"
                        onClick={popUpEdit.setTrue}
                     >
                        <i className="fa-solid fa-pencil pe-2"></i>
                        <span>Edit</span>
                     </button>
                  </li>
               )}
               {user && ((post.authorId && user?._id === post.authorId._id) || findOwnership(post)) && (
                  <li>
                     <button
                        className="dropdown-item text-danger"
                        onClick={popUpDelete.setTrue}
                     >
                        <i className="fa-solid fa-trash-can pe-2"></i>
                        <span>Delete</span>
                     </button>
                  </li>   
               )}
               {user?.role === "admin" && (
                  <li>
                     <button
                        className="dropdown-item text-danger"
                        onClick={() => popUpArchive.setTrue()}
                     >
                        <i className="fa-solid fa-lock pe-2"></i>
                        <span>Archive</span>
                     </button>
                  </li>
               )}
            </ul>
         </div>

         <PopupEditor
            status='edit'
            modalTitle="Editing Post"
            post={post}
            setPost={setPost}
            showTitle={post.parentId === null}
            {...popUpEdit}
         />

         <PopupEditor
            status='reply'
            modalTitle={`Replying to ${post && post.authorId && post.authorId.username}`}
            post={post}
            setPost={setPost}
            {...popUpReply}
         />

         <PopUpBase
            {...popUpDelete}
            onConfirm={onDeleteConfirm}
            title="Confirmation"
            desc={`Are you sure you want to delete this post?`}
         />

         <PopUpBase
            {...popUpArchive}
            onConfirm={onArchiveConfirm}
            title="Confirmation"
            desc={`Are you sure you want to archive this post?`}
         />
      </>
   );
};

export default Interact;
