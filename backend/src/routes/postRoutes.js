const express = require('express');
const validateAuth = require('../validators/authValidator');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

const router = express.Router();

router.get('/', validateAuth, getPosts);
router.post('/', validateAuth, createPost);
router.delete('/:id', validateAuth, deletePost);
router.get('/:id', validateAuth, getPostById);
//router.patch('/:id', updatePost);

module.exports = router;
