import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import util from "util";

var storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: 'photos',
            filename: `${Date.now()}-${file.originalname}`
        };
    }
});

var uploadFiles = multer({ storage: storage }).array("images", 5);

export default uploadFiles;
