const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user.model');

const app = express();

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/userdb';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// === JSON APIs ===

// CREATE user (Register) - POST /users
app.post('/users', async (req, res, next) => {
  try {
    const { username, email, password, address, number } = req.body;

    if (!username || !email || !password || !address || !number) {
      return res.status(400).json({
        message: 'username, email, password, address and number are required',
      });
    }

    const newUser = new User({ username, email, password, address, number });
    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

// READ all users - GET /api/users (JSON)
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    next(err);
  }
});

// READ single user - GET /api/users/:id (JSON)
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    next(err);
  }
});

// UPDATE user - PUT /users/:id
app.put('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password, address, number } = req.body;

    if (!username && !email && !password && !address && !number) {
      return res.status(400).json({
        message: 'At least one of username, email, password, address or number is required',
      });
    }

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = password;
    if (address !== undefined) updateData.address = address;
    if (number !== undefined) updateData.number = number;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// DELETE user - DELETE /users/:id
app.delete('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// LOGIN user - POST /login
// Basic login: checks email and password and returns user data if matched
app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({ message: 'Login successful', user });
  } catch (err) {
    next(err);
  }
});

// === HTML views (matching assignment screenshots) ===

// Redirect root to users list
app.get('/', (req, res) => {
  res.redirect('/users');
});

// List all users - HTML view
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.render('users', { users });
  } catch (err) {
    next(err);
  }
});

// Show create-user form
app.get('/user/create', (req, res) => {
  res.render('user-create');
});

// Handle create-user form submission
app.post('/user/create', async (req, res, next) => {
  try {
    const { username, email, password, address, number } = req.body;

    if (!username || !email || !password || !address || !number) {
      return res.status(400).send('All fields are required');
    }

    await User.create({ username, email, password, address, number });
    res.redirect('/users');
  } catch (err) {
    next(err);
  }
});

// Show single user profile
app.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('user-profile', { user });
  } catch (err) {
    next(err);
  }
});

// Show edit form
app.get('/users/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('user-edit', { user });
  } catch (err) {
    next(err);
  }
});

// Handle edit form submission
app.post('/users/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password, address, number } = req.body;

    await User.findByIdAndUpdate(
      id,
      { username, email, password, address, number },
      { new: true, runValidators: true }
    );

    res.redirect('/users');
  } catch (err) {
    next(err);
  }
});

// Handle delete from profile page
app.post('/users/:id/delete', async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/users');
  } catch (err) {
    next(err);
  }
});

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
