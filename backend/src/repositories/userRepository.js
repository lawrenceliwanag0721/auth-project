const User = require('../models/User');

const findByUsername = (username) => User.findOne({ username });

const findAllPublic = () => User.find()
  .select(['-password', '-email'])
  .sort({ createdAt: -1 });

const findPublicById = (userId) => User.findById(userId)
  .select(['-password', '-email']);

const findByUsernameOrEmail = (username, email) => User.findOne({
  $or: [{ username }, { email }],
});

const create = (userData) => User.create(userData);

const updateById = (userId, updates) => User.findByIdAndUpdate(
  userId,
  updates,
  { new: true, runValidators: true }
).select('-password');

const deleteById = (userId) => User.findByIdAndDelete(userId);

module.exports = {
  findByUsername,
  findAllPublic,
  findPublicById,
  findByUsernameOrEmail,
  create,
  updateById,
  deleteById,
};
