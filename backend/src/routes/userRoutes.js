const express = require('express');

const {
  loginUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
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
router.post('/signup', validateSignUpMiddleware, createUser);
router.post('/signin', validateSignInMiddleware, loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


module.exports = router;