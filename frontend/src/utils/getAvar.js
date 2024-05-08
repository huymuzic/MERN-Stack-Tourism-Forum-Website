const getAvatarUrl = (avatar, baseURL) => {
    // Check if avatar is a GridFS URL, UI Avatar, or Base64 string
    if (avatar && (avatar.startsWith('https://ui-avatars.com/api/') || avatar.startsWith('data:image'))) {
      return avatar; // Return as it is
    } else  {
      return `${baseURL}${avatar}`;
    } 
  };
  
export { getAvatarUrl };
  