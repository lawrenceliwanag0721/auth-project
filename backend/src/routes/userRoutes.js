const express = require('express');

const {
  signInUser,
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
router.get('/test', (req, res) => {
  res.json({msg: "hello from router!!"})
});

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/signup', validateSignUpMiddleware, createUser);
router.post('/signin', validateSignInMiddleware, signInUser);
router.put('/:id', updateUser);
//router.delete('/:id', deleteUser);

module.exports = router;