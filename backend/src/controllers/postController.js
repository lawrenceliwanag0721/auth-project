require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("AuthToken:", req.cookies?.AuthToken);
    const token = req.cookies?.AuthToken;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      author: decoded.id,
    });

    // Get author's name for the response
    await post.populate("author", "name");

    return res.status(201).json(post);
  } catch (error) {
    console.error(error);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    return res.status(500).json({
      message: "Failed to create post",
    });
  }
};

const getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'username email')
    .sort({ createdAt: -1 });
  res.json(posts);
};

const getPostById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  const post = await Post.findById(req.params.id).populate(
    'author',
    'username email'
  );
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post);
};

const updatePost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('author', 'username email');

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post);
};

const deletePost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(204).send();
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
