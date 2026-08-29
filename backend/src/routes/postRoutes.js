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
//router.patch('/:id', updatePost);
//router.get('/:id', getPostById);
module.exports = router;
