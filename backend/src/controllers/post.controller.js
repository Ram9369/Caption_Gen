const postModel = require("../models/post.model");
const generateCaption = require("../service/ai.service");
const uploadFile = require("../service/storage.service");

const { v4: uuidv4 } = require("uuid");

async function getAllPostsController(req, res) {
    const posts = await postModel.find({
      user: req.user._id,
    });

    res.status(200).json(posts);
  }
async function createPostController(req, res) {
  try {
    const file = req.file;

    const base64Image = Buffer.from(file.buffer).toString("base64");

    const caption = await generateCaption(base64Image);

    const result = await uploadFile(
      file.buffer,
      `${uuidv4()}`
    );

    const post = await postModel.create({
      caption,
      image: result.url,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Post created Successfully",
      post,
    });
  } catch (error) {
    console.error("POST ERROR:", error);

    res.status(503).json({
      message: error.message,
    });
  }
}

module.exports = { createPostController, getAllPostsController };
