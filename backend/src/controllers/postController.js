require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user.id,
    });
    await post.populate("author", "name");

    return res.status(201).json(post);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create post",
    });
  }
};

const getPosts = async (req, res) => {
  const userId = req.user.id;

  const posts = await Post.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  const postsWithPerm = posts.map(post => ({
    ...post.toObject(),
    canDelete: userId.toString() === post.author._id.toString()
  }));

  res.json(postsWithPerm);
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

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    if (post.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: 'Unauthorized deletion...'
      });
    }

    await post.deleteOne();
    res.status(204).send();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
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
module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
