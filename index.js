const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto"
    });
    fs.unlinkSync(req.file.path);

    res.json({ success: true, url: result.secure_url });
  } catch {
    res.status(500).json({ error: "Upload gagal" });
  }
});

app.get("/", (req, res) => {
  res.send("Upload API Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);