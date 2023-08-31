const express = require("express");
const multer = require("multer");
const uploadlinksRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/upload/video_links/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/mp4") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only text files are allowed."));
  }
};
const upload = multer({ storage, fileFilter });

uploadlinksRouter.post("/", upload.single("uploadVideo"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  const { originalname, filename, path } = req.file;
  return res.status(200).json({ message: "File uploaded successfully.", originalname, filename, path });
});

module.exports = uploadlinksRouter;
