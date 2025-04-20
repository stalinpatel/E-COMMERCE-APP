import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { getPaths } from "../lib/getPaths.js";
import path from "path";
const { __filename, __dirname } = getPaths(import.meta.url);
import fs from "fs"; // For checking/creating the directory

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.resolve(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext); // ✅
  },
});
export const upload = multer({ storage });
