const express = require('express');
const validateAuth = require('../validators/authValidator');
const upload = require('../middleware/upload')
const { validatePostUpdateMiddleware } = require('../validators/postValidator');
const {
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
  getBookmark
} = require('../controllers/postController');

const router = express.Router();

router.get('/', validateAuth, getPosts);
router.post('/', validateAuth, upload.single('image'), createPost);
router.get('/:id/reply', validateAuth, getReply);
router.post('/:id/reply', validateAuth, replytoPost);
router.get('/bookmark', validateAuth, getBookmark);
router.patch('/:id', validateAuth, validatePostUpdateMiddleware, updatePost);
router.get('/:id', validateAuth, getPostById);
router.post('/like/:id', validateAuth, setLike);
router.delete('/like/:id', validateAuth, deleteLike);
router.post('/:id/bookmark', validateAuth, setBookmark);
router.delete('/:id/bookmark', validateAuth, deleteBookmark);
router.delete('/:id', validateAuth, deletePost);

module.exports = router;
