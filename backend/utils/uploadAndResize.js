import multer from "multer";
import { MongoClient as MongoClient6, GridFSBucket } from "mongodb6";
import sharp from "sharp";
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

      try {
        const resizedBuffer = await sharp(req.file.buffer)
          .resize({ width: 1000, height: 667, fit: "contain" })
          .toBuffer();

        const mongoClient = await MongoClient6.connect(process.env.MONGO_URI);

        const db = mongoClient.db();

        const bucket = new GridFSBucket(db, {
          bucketName: "tourPhotos",
        });

        const uploadStream = bucket.openUploadStream(req.file.originalname, {
          contentType: req.file.mimetype,
        });

        uploadStream.end(resizedBuffer);

        uploadStream.on("finish", async () => {
          req.file.id = uploadStream.id.toString();
          await mongoClient.close();
          next();
        });

        uploadStream.on("error", async (error) => {
          console.error("Error during upload:", error);
          await mongoClient.close();
          next(error);
        });
      } catch (err) {
        console.error("Error during processing:", err.message);
        next(err);
      }
    });
  } catch (err) {
    console.error("Middleware error:", err.message);
    next(err);
  }
};
