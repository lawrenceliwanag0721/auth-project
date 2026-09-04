require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Reply = require('../models/Reply');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const id = req.user.id
    const post = await Post.create({
      title,
      content,
      author: id,
    });

    await post.populate('author', 'username');

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
const deleteLike = async (req, res) => {
      try {
        const userId = req.user.id;
        const postId = req.params.id;

        const deletedLike = await Like.findOneAndDelete({
            userId: userId,
            postId: postId
        });

        if (!deletedLike) {
            return res.status(404).json({
                message: "Like not found"
            });
        }

        return res.sendStatus(204);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to remove like"
        });
    }
}
const postAuthorize = async (posts, userId) => {
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
const postAuthorizeSingle = async (post, userId) =>{
  const like = await Like.findOne({userId: userId, postId: post._id});
  post.canDelete = userId.toString() === post.author._id.toString();
  post.canEdit = userId.toString() === post.author._id.toString();
  post.liked = !!like;
  return post;
};
const getPosts = async (req, res) => {
  const userId = req.user.id;

  const posts = await Post.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  const authorizedPost = await postAuthorize(posts, userId);

  res.json(authorizedPost);
};
const getPostById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }
  const userId = req.user.id;
  const post = await Post.findById(req.params.id).populate('author', 'username').lean();

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  const authorizedPost = await postAuthorizeSingle(post, userId);

  res.json(authorizedPost);
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
const getReply = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  const replies = await Reply.find({parentPost: postId})
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  const authorizedPost = await postAuthorize(replies, userId);

  res.json(authorizedPost);
}
const replytoPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id
  const postId = req.params.id;
  try {
    const reply = await Reply.create({
      content: content,
      author: userId,
      parentPost: postId,
    });
    await reply.populate('author', 'username');

    return res.status(201).json(reply);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create reply",
    });
  }
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  setLike,
  deleteLike,
  replytoPost,
  getReply,
};
