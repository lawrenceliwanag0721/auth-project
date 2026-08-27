require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const signInUser = async (req, res) => {
  const {username, password} = req.body;
	try {
		const user = await User.findOne({
      username: username
    });

		if (!user) {
			return res.status(401).json({
        message: "User not found..." 
      });
		}

		const correctPassword = await bcrypt.compare(
      password, user.password
    );

		if (!correctPassword) {
			return res.status(401).json({ 
        message: "Password incorrect..." 
      });
		}

		const token = jwt.sign(
			{ id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.cookie("AuthToken", token, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: 60 * 60 * 1000
		});
    console.log(username + ' logged in')
		return res.json({ 
      message: "Login successful" 
    });
	}catch (error) {
    console.log(error);
		return res.status(500).json({ 
      message: "server error" 
    });
	}
};

const getUsers = async (req, res) => {
  const users = await User.find().select(['-password','-email']).sort({ createdAt: -1 });
  res.json(users);
};

const getUserById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid user ID'
    });
  }

  const user = await User.findById(req.params.id).select(['-password','-email']);
  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  res.json(user);
};

const createUser = async (req, res) => {
  const { username, email, password} = req.body;

  const existingUser = await User.findOne({
      $or: [
          { username: username },
          { email: email }
      ]
  });

  if (existingUser) {
    return res.status(401).json({
      message: "Account already exists..." 
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const response = user.toObject();
  delete response.password;
  res.status(201).json({message: "Registration complete!"});
};

const updateUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const updates = { ...req.body };
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};

const deleteUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(204).send();
};

const isTokenExists = async (req, res) => {
  res.status(200).json({ 
    msg: "client has Token"
  })}

module.exports = {
  signInUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  isTokenExists,
};
