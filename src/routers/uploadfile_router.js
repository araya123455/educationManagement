const express = require("express");
const multer = require("multer");
const uploadFileRouter = express.Router();

// Define the storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/upload/file_pdf/");
  },
  filename: (req, file, cb) => {
    // Keep the original file name
    cb(null, file.originalname);
  },
});

// Define a file filter to only accept PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF files are allowed."));
  }
};

// Create a multer instance with the configured storage and file filter
const upload = multer({ storage, fileFilter });

// Define the POST route for uploading a single file
uploadFileRouter.post("/", upload.single("uploadFile"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  // If you want to send a success response, you can do something like this:
  const { originalname, filename, path } = req.file;
  return res.status(200).json({ message: "File uploaded successfully." });
});

module.exports = uploadFileRouter;
