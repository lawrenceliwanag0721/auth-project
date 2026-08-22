const express = require('express');

const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
