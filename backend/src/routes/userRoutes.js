const express = require('express');
const validateAuth = require('../validators/authValidator');
const {
  signInUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  isTokenExists,
} = require('../controllers/userController');
const {
  validateSignUpMiddleware,
  validateSignInMiddleware,
  validateUser,
  validateUserUpdate,
  validateUserMiddleware,
  validateUserUpdateMiddleware,
} = require('../validators/userValidator');
const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validateAuth, isTokenExists);
router.post('/signup', validateSignUpMiddleware, createUser);
router.post('/signin', validateSignInMiddleware, signInUser);
router.put('/:id', updateUser);
//router.delete('/:id', deleteUser);

module.exports = router;