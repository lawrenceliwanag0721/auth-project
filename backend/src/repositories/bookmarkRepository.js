const Bookmark = require('../models/Bookmark');

const create = (userId, postId) => Bookmark.create({ userId, postId });

const deleteByUserAndPost = (userId, postId) =>
  Bookmark.findOneAndDelete({ userId, postId });

const findByUser = (userId) => Bookmark.find({ userId });

const findByUserWithPosts = (userId) => Bookmark.find({ userId })
  .populate({
    path: 'postId',
    select: 'content author',
    populate: {
      path: 'author',
      select: 'username',
    },
  })
  .lean()
  .sort({ createdAt: -1 });

module.exports = {
  create,
  deleteByUserAndPost,
  findByUser,
  findByUserWithPosts,
};
