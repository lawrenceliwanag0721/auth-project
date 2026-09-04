const express = require('express');
const validateAuth = require('../validators/authValidator');
const upload = require('../middleware/upload')
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  setLike,
  deleteLike,
  replytoPost,
  getReply
} = require('../controllers/postController');

const router = express.Router();

router.get('/', validateAuth, getPosts);
router.post('/', validateAuth, upload.single('image'), createPost);
router.get('/:id/reply', validateAuth, getReply);
router.post('/:id/reply', validateAuth, replytoPost);
router.delete('/:id', validateAuth, deletePost);
router.get('/:id', validateAuth, getPostById);
router.post('/like/:id', validateAuth, setLike);
router.delete('/like/:id', validateAuth, deleteLike);
//router.patch('/:id', updatePost);

module.exports = router;
