// avatarUpload.js
import multer from 'multer';
import { storage } from './gridfsconfig.js';

// Create a multer instance and pass the storage
const upload = multer({ storage });

export default upload;
