import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

    if (match.indexOf(file.mimetype) === -1) {
      return `${Date.now()}-${file.originalname}`;
    }

    return {
      bucketName: 'photos',
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const uploadFiles = multer({ storage: storage }).single('photo');  // Single file upload with field name 'photo'

export default uploadFiles;
