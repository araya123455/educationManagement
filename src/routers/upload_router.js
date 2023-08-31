const express = require("express");
const multer = require("multer");
const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().getTime()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

uploadRouter.post("/", upload.single("uploaded-file"), (req, res, next) => {
  return res.send(req.file);
});

module.exports = uploadRouter;
