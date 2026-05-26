const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// ── REGISTER ────────────────────────────────────────────
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  try {
    // Check if email already exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0)
      return res.status(409).json({ message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: result.insertId, name, email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── LOGIN ───────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    // Find user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );
    if (users.length === 0)
      return res.status(401).json({ message: 'Invalid email or password' });

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── GET LOGGED IN USER ──────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json({ user: users[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};