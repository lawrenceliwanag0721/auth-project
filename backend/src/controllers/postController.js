const mongoose = require('mongoose');

const Post = require('../models/Post');

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

const createPost = async (req, res) => {
  const { title, content, author, published } = req.body;
  const post = await Post.create({ title, content, author, published });
  await post.populate('author', 'username email');
  res.status(201).json(post);
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
