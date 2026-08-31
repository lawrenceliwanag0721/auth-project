const express = require('express');
const validateAuth = require('../validators/authValidator');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  setLike,
  deleteLike,
} = require('../controllers/postController');

const router = express.Router();

router.get('/', validateAuth, getPosts);
router.post('/', validateAuth, createPost);
router.post('/like/:id', validateAuth, setLike);
router.delete('/like/:id', validateAuth, deleteLike);
router.delete('/:id', validateAuth, deletePost);
router.get('/:id', validateAuth, getPostById);
//router.patch('/:id', updatePost);

module.exports = router;
