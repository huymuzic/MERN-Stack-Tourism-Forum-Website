import multer from "multer";
import { GridFSBucket } from "mongodb";
import sharp from "sharp";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single("photo");

export const uploadAndResizeMiddleware = async (req, res, next) => {
  try {
    await upload(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      if (!req.file) {
        return next();
      }
      console.log(req.file.buffer);
      try {
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
          req.file.id = uploadStream.id.toString();
          next();
        });

        uploadStream.on("error", (error) => {
          next(error);
        });
      } catch (err) {
        console.error(err);
        return next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};
