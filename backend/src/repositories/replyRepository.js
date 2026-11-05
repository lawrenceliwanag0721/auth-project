const Reply = require('../models/Reply');

const create = async (replyData) => {
  const reply = await Reply.create(replyData);
  return reply.populate('author', 'username');
};

const findByPost = (postId) => Reply.find({ parentPost: postId })
  .populate('author', 'username')
  .sort({ createdAt: -1 });

module.exports = {
  create,
  findByPost,
};
