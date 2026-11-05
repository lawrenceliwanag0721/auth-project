const Like = require('../models/Like');

const create = (userId, postId) => Like.create({ userId, postId });

const deleteByUserAndPost = (userId, postId) =>
  Like.findOneAndDelete({ userId, postId });

const findByUser = (userId) => Like.find({ userId });

const findByUserAndPost = (userId, postId) =>
  Like.findOne({ userId, postId });

module.exports = {
  create,
  deleteByUserAndPost,
  findByUser,
  findByUserAndPost,
};
