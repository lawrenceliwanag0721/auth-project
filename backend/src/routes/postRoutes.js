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
//router.get('/:id', getPostById);
router.post('/', validateAuth, createPost);
//router.patch('/:id', updatePost);
router.delete('/:id', validateAuth, deletePost);

module.exports = router;

//fetch(apiroute/${id}) method:delete