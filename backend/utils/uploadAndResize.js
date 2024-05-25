import multer from "multer";
import { GridFSBucket } from "mongodb";
import sharp from "sharp";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Use memory storage for multer
const storage = multer.memoryStorage();

// Configure for single file upload with field name "photo"
const upload = multer({ storage: storage }).single("photo");

// Middleware to upload and resize image
export const uploadAndResizeMiddleware = async (req, res, next) => {
  try {
    // Upload the file using multer
    await upload(req, res, async (err) => {
      if (err) {
        return next(err); // Propagate upload errors
      }

      if (!req.file) {
        return next(); // No file uploaded, skip resizing
      }
      console.log(req.file.buffer);
      try {
        // Resize the uploaded image using Sharp
        const buffer = await sharp(req.file.buffer)
          .resize({ width: 1000, height: 667, fit: "contain" })
          .toBuffer();

        req.file.buffer = buffer;

        const bucket = new GridFSBucket(mongoose.connection.db, {
          bucketName: "photos",
        });

        const uploadStream = bucket.openUploadStream(req.file.originalname, {
          contentType: req.file.mimetype,
        });

        uploadStream.end(buffer);

        uploadStream.on("finish", () => {
          req.file.id = uploadStream.id; // Store the file ID in the request object
          next(); // Proceed to the next middleware
        });

        uploadStream.on("error", (error) => {
          next(error); // Propagate errors
        });
      } catch (err) {
        console.error(err);
        return next(err); // Propagate resize errors
      }
    });
  } catch (err) {
    next(err); // Propagate other errors
  }
};
