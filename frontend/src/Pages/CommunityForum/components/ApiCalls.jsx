import { openDB } from 'idb';
import { pushSuccess, pushError } from '../../../components/Toast';
import { baseUrl } from '../../../config';

export async function handleLike(postId, setPost, userId) {
   try {
      const response = await fetch(`${baseUrl}/api/forum/p/${postId}/like`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         credentials: 'include',
      });

      if (!response.ok) {
         const errorData = await response.json();
         pushError(errorData.message); 
         return;
      }

      const responseBody = await response.json();

      populateImages(responseBody.post.images).then((images) => {
         responseBody.post.images = images;
         setPost(responseBody.post);
      });
      pushSuccess(`Post ${responseBody.post.likes.includes(userId) ? '' : 'un'}liked`)
   } catch (error) {
      pushError('Unable to like post')
      console.error(error);
   }
};

export async function handledelete(postId, setPost) {
   try {
      const response = await fetch(`${baseUrl}/api/forum/p/${postId}/deletePost`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         credentials: 'include',
      });

      if (!response.ok) {
         const errorData = await response.json();
         pushError(errorData.message); 
         return;
      }

      const responseBody = await response.json();
      setPost(responseBody.post);
      pushSuccess('Post deleted')
   } catch (error) {
      pushError('Unable to delete post')
      console.error(error);
   }
};

export async function replyTopic(id, content, images, setPost, nav, close) {
   try {
      const formData = new FormData();
      formData.append('content', content);
      images.forEach((image) => {
         formData.append('images', image);
      });

      const response = await fetch(`${baseUrl}/api/forum/p/${id}/reply`, {
         method: 'POST',
         credentials: 'include',
         body: formData,
      });

      if (!response.ok) {
         const errorData = await response.json();
         pushError(errorData.message); 
         return;
      }

      const responseBody = await response.json();
      nav(`/forum/p/${responseBody.repId}`)
      populateImages(responseBody.parentPost.images).then((images) => {
         responseBody.parentPost.images = images;
         setPost(responseBody.parentPost);
      });
      close();
      pushSuccess('Replied to post');
   } catch (error) {
      pushError('Failed to reply to post');
      console.error(error.message);
   }
}

export const populateImages = async (imagesArray) => {
   const db = await openDB('my-db', 1, {
      upgrade(db) {
         const store = db.createObjectStore('images', { keyPath: 'id' });
         store.createIndex('timestamp', 'timestamp');
      },
   });

   const images = await Promise.all(imagesArray.map(async (image) => {
      let blob = image;

      if (!image.blob) {
         const cachedImage = await db.get('images', image);

         if (cachedImage) {
            blob = cachedImage;
         } else {
            const response = await fetch(`${baseUrl}/api/forum/images/${image}`);
            const newBlob = await response.blob();

            try {
               blob = { id: image, blob: newBlob, timestamp: Date.now() };
               await db.put('images', blob);
            } catch (error) {
               const oldestImage = await db.transaction('images', 'readwrite').store.index('timestamp').openCursor();
               if (oldestImage) {
                  await db.delete('images', oldestImage.primaryKey);
                  blob = { id: image, blob: newBlob, timestamp: Date.now() };
                  await db.put('images', blob);
               }
            }
         }
      }

      return blob;
   }));

   return images;
};

export async function createTopic(title, content, images, nav, close) {
   try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      images.forEach((image) => {
         formData.append('images', image);
      });

      const response = await fetch(`${baseUrl}/api/forum`, {
         method: 'POST',
         credentials: 'include',
         body: formData,
      });

      if (!response.ok) { 
         const errorData = await response.json();
         pushError(errorData.message); 
         return;
      }


      const data = await response.json();
      nav(`/forum/p/${data.postId}`)
      close();
      pushSuccess('Post created');
   } catch (error) {
      pushError('Failed to create post');
      console.error('Error:', error.message);
   }
}

export async function edit(postId, title, content, images, removed, setPost, nav, close) {
   try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      images.forEach((image) => {
         formData.append('images', image);
      });
      formData.append('removed', JSON.stringify(removed));
      
      const response = await fetch(`${baseUrl}/api/forum/p/${postId}/edit`, {
         method: 'PUT',
         credentials: 'include',
         body: formData,
      });

      const body = await response.json();

      if (!response.ok) {
         const errorData = await response.json();
         pushError(errorData.message); 
         return
      }
      
      populateImages(body.post.images).then((images) => {
         body.post.images = images;
         setPost(body.post);
      });
      nav(`/forum/p/${postId}`)
      close();
      pushSuccess('Post edited successfully');
   } catch (error) {
      pushError('Failed to edit post');
      console.error('Error:', error.message);
   }
}

export async function archive(id, setPost) {
   try {
      const url = new URL(
         `${baseUrl}/api/v1/posts/hide/${id}`
      );

      const response = await fetch(url, {
         method: "PUT",
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
         },
      });
      if (!response.ok) {
         const errorData = await response.json();
         pushError(errorData.message); 
         return
      }
      if (response.ok) {
         const data = await response.json();
         pushSuccess("Post archived successfully");
         setPost(data)
      } else {
         throw new Error("Failed to archive post");
      }

   } catch (error) {
      pushError("Failed to archive post");
   }
}