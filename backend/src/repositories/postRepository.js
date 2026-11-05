const Post = require('../models/Post');

const create = async (postData) => {
  const post = await Post.create(postData);
  return post.populate('author', 'username');
};

const findById = (postId) => Post.findById(postId);

const findAll = () => Post.find()
  .populate('author', 'username')
  .sort({ createdAt: -1 });

const findByIdWithAuthor = (postId) => Post.findById(postId)
  .populate('author', 'username')
  .lean();

const findByIdAndAuthorAndUpdate = (postId, authorId, updates) =>
  Post.findOneAndUpdate(
    { _id: postId, author: authorId },
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('author', 'username');

const deleteById = (postId) => Post.findByIdAndDelete(postId);

const exists = (postId) => Post.exists({ _id: postId });

module.exports = {
  create,
  findById,
  findAll,
  findByIdWithAuthor,
  findByIdAndAuthorAndUpdate,
  deleteById,
  exists,
};
