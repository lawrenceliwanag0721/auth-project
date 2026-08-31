require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Like = require('../models/Like');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const id = req.user.id
    const post = await Post.create({
      title,
      content,
      author: id,
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create post",
    });
  }
};

const setLike = async (req, res) =>{
  const id = req.user.id;
  const postId = req.params.id;

  try{
    const like = await Like.create({
      userId: id,
      postId: postId
    });
    console.log(like);

    return res.sendStatus(204); 
  }catch(error){
    if (error.code === 11000) {
      console.log("like duplicate");
    }
  }
};

const postmodifier = async (posts, userId) => {
  const likes = await Like.find({userId: userId})

  const userLikes = new Set(
    likes.map((like) => like.postId.toString())
  )

  const postdocs = posts.map(post => ({
    ...post.toObject(),
    canDelete: userId.toString() === post.author._id.toString(),
    canEdit: userId.toString() === post.author._id.toString(),
    liked: userLikes.has(post._id.toString())
  }));

  return postdocs;
};

const getPosts = async (req, res) => {
  const userId = req.user.id;

  const posts = await Post.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  const postdocs = await postmodifier(posts, userId);

  res.json(postdocs);
};

const getPostById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }
  const userId = req.user.id;
  const post = await Post.findById(req.params.id).populate('author', 'username' ).lean();

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const like = await Like.findOne({userId: userId, postId: post._id});
  if(like) post.liked = true;
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
  setLike,
};
