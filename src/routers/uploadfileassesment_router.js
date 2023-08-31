const express = require("express");
const multer = require("multer");
const uploadFileRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/upload/assesment/");
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF files are allowed."));
  }
}; 
const upload = multer({ storage });

uploadFileRouter.post("/", upload.single("uploadAsses "), (req, res, next) => {
  return res.send( req.file)
  // if (!req.file) {
  //   return res.status(400).json({ message: "No file uploaded." });
  // }
  // const { originalname, filename, path } = req.file;
  // return res.status(200) .json({ message: "File uploaded successfully." });
});

module.exports = uploadFileRouter;
