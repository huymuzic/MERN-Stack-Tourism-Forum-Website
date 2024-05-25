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

      console.log("File uploaded:", req.file.originalname);

      try {
        const resizedBuffer = await sharp(req.file.buffer)
          .resize({ width: 1000, height: 667, fit: "contain" })
          .toBuffer();

        console.log("Buffer length:", resizedBuffer.length);

        const mongoClient = await MongoClient6.connect(
          "mongodb+srv://huymarky05:testpass@backenddb.xy1qasp.mongodb.net/travel-forum?retryWrites=true&w=majority&appName=BackendDB"
        );

        const db = mongoClient.db();
        console.log("Connected to MongoDB");

        const bucket = new GridFSBucket(db, {
          bucketName: "tourPhotos",
        });

        const uploadStream = bucket.openUploadStream(req.file.originalname, {
          contentType: req.file.mimetype,
        });

        console.log("Uploading file to GridFS...");

        uploadStream.end(resizedBuffer);

        uploadStream.on("finish", async () => {
          console.log("Upload finished, file ID:", uploadStream.id.toString());
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
