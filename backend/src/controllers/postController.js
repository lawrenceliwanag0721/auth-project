require('dotenv').config();
const mongoose = require('mongoose');
const postRepository = require('../repositories/postRepository');
const likeRepository = require('../repositories/likeRepository');
const replyRepository = require('../repositories/replyRepository');
const bookmarkRepository = require('../repositories/bookmarkRepository');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const id = req.user.id

    const post = await postRepository.create({
      title,
      content,
      author: id,
      image: req.file ? `/uploads/posts/${req.file.filename}` : null
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
    await likeRepository.create(id, postId);

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

        const deletedLike = await likeRepository.deleteByUserAndPost(userId, postId);

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

const setBookmark = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  if (!mongoose.isValidObjectId(postId)) {
    return res.status(400).json({
      message: 'Invalid post id'
    });
  }

  try {
    const postExists = await postRepository.exists(postId);

    if (!postExists) {
      return res.status(404).json({
         message: 'Post not found'
      });
    }

    const bookmark = await bookmarkRepository.create(userId, postId);

    return res.status(201).json(bookmark);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Bookmark already exists'
      });
    }
    console.error(error);
    return res.status(500).json({
      message: 'Server error'
    });
  }
};

const deleteBookmark = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  if (!mongoose.isValidObjectId(postId)) {
    return res.status(400).json({
      message: 'Invalid post id'
    });
  }

  try {
    const deletedBookmark = await bookmarkRepository.deleteByUserAndPost(userId, postId);

    if (!deletedBookmark) {
        return res.status(404).json({
            message: "bookmark not found"
        });
    }

    return res.status(200).json(deletedBookmark);

  }catch(error) {
    return res.status(500).json({
      message: "Failed to remove bookmark"
    });
  }
}

const getBookmark = async (req, res) => {
  try {
    const bookmarks = await bookmarkRepository.findByUserWithPosts(req.user.id);

    return res.status(200).json(bookmarks.filter((bookmark) => bookmark.postId));
  } catch (error) {
    console.error('getBookmark error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const postAuthorize = async (posts, userId) => {
  const likes = await likeRepository.findByUser(userId);

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
  const like = await likeRepository.findByUserAndPost(userId, post._id);
  post.canDelete = userId.toString() === post.author._id.toString();
  post.canEdit = userId.toString() === post.author._id.toString();
  post.liked = !!like;
  return post;
};


const getPosts = async (req, res) => {
  const userId = req.user.id;

  // const cachedPosts = await redis.get("posts");

  // if (cachedPosts) {
  //   const authorizedPost = await postAuthorize(cachedPosts, userId);
  //   return res.json(JSON.parse(authorizedPost));
  // }

  const posts = await postRepository.findAll();

  // await redis.set(
  //     "posts",
  //     JSON.stringify(posts),
  //     { EX: 60 }
  // );

  const authorizedPost = await postAuthorize(posts, userId);

  res.json(authorizedPost);
};

const getPostById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }
  const userId = req.user.id;
  const post = await postRepository.findByIdWithAuthor(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  const authorizedPost = await postAuthorizeSingle(post, userId);

  res.json(authorizedPost);
};

const deletePost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid post ID'
    });
  }

  try {
    const post = await postRepository.findById(req.params.id);

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

    await postRepository.deleteById(post._id);
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

  try {
    const post = await postRepository.findByIdAndAuthorAndUpdate(
      req.params.id,
      req.user.id,
      req.body
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json(post);
  } catch (error) {
    console.error('updatePost error:', error);
    return res.status(500).json({ message: 'Failed to update post' });
  }
};
const getReply = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  const replies = await replyRepository.findByPost(postId);

  const authorizedPost = await postAuthorize(replies, userId);

  res.json(authorizedPost);
}
const replytoPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id
  const postId = req.params.id;
  try {
    const reply = await replyRepository.create({
      content: content,
      author: userId,
      parentPost: postId,
    });

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
  setBookmark,
  deleteBookmark,
  getBookmark,
};
