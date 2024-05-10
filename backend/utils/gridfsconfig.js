// utils/gridFsConfig.js
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import {GridFsStorage} from 'multer-gridfs-storage'
import crypto from 'crypto';
import path from 'path';

// MongoDB URI
const mongoURI = process.env.MONGO_URI;

// Create a storage object with a given configuration
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = `${buf.toString('hex')}${path.extname(file.originalname)}`;
        const fileInfo = {
          filename,
          bucketName: 'avatars', // Collection name
        };
        resolve(fileInfo);
      });
    });
  },
});

// Set up GridFSBucket to stream files to/from MongoDB
let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, { bucketName: 'avatars' });
}); 

export { storage, gfs };
