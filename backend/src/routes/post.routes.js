const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const {
  createPostController,
  getAllPostsController,
} = require("../controllers/post.controller");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// POST/api/post-[Protected ]
router.post("/", authMiddleware, upload.single("image"), createPostController);
router.get("/", authMiddleware, getAllPostsController);

module.exports = router;
