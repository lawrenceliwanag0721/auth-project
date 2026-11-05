const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Reply|| mongoose.model('Reply', replySchema);
