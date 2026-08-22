require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 100,
//     standardHeaders: 'draft-8',
//     legacyHeaders: false,
//   })
// );

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/user', require('./src/routes/userRoutes'));
app.use('/api/post', require('./src/routes/postRoutes'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const startServer = async () => {
  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured');
  }

  await mongoose.connect(mongoUri);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

module.exports = app;
