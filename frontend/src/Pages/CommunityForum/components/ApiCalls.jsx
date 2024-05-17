import { openDB } from 'idb';

export async function handleLike(postId, setPost, setUser) {
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum/p/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to like post');
        }

        const responseBody = await response.json();
        setPost(responseBody.post);
        setUser(responseBody.user);
    } catch (error) {
        console.error(error);
    }
};

export async function replyTopic(content, images, nav, id) {
    const token = localStorage.getItem('accessToken');

    try {
        const formData = new FormData();
        formData.append('content', content);
        images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum/p/${id}/reply`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            return;
            //throw new Error('Failed to reply to post');
        }

        const responseBody = await response.json();
        //setPost(responseBody.post);
        //setUser(responseBody.user);
        nav(`/forum/p/${responseBody.repId}`)
        document.getElementById("modalClose").click();
    } catch (error) {
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
        let blob;

        const cachedImage = await db.get('images', image);

        if (cachedImage) {
            blob = cachedImage.blob;
        } else {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum/images/${image}`);
            blob = await response.blob();

            try {
                await db.put('images', { id: image, blob, timestamp: Date.now() });
            } catch (error) {
                const oldestImage = await db.transaction('images', 'readwrite').store.index('timestamp').openCursor();
                if (oldestImage) {
                    await db.delete('images', oldestImage.primaryKey);
                    await db.put('images', { id: image, blob, timestamp: Date.now() });
                }
            }
        }

        return blob;
    }));

    return images;
};

export async function createTopic(title, content, images, navigate) {
    const token = localStorage.getItem('accessToken');

    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/forum`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            //throw new Error(`HTTP error! message: ${response.status}`);
            return;
        }

        const data = await response.json();
        document.getElementById("modalClose").click();
        navigate(`/forum/p/${data.postId}`)
    } catch (error) {
        console.error('Error:', error.message);
    }
}