const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { userId, password } = req.body;
  if (!userId?.trim() || !password) return res.status(400).json({ error: 'missing_fields' });

  const exists = await User.findOne({ userId: userId.trim() });
  if (exists) return res.status(409).json({ error: 'taken' });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ userId: userId.trim(), password: hashed });

  const token = jwt.sign({ userId: userId.trim() }, process.env.JWT_SECRET, { expiresIn: '90d' });
  res.status(201).json({ token, userId: userId.trim() });
});

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  if (!userId?.trim() || !password) return res.status(400).json({ error: 'missing_fields' });

  const user = await User.findOne({ userId: userId.trim() });
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'invalid_credentials' });

  const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '90d' });
  res.json({ token, userId: user.userId });
});

router.get('/check/:userId', async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId.trim() });
  if (!user) return res.status(404).json({ error: 'not_found' });
  res.json({ exists: true });
});

router.post('/reset-password', async (req, res) => {
  const { userId, newPassword } = req.body;
  if (!userId?.trim() || !newPassword) return res.status(400).json({ error: 'missing_fields' });

  const user = await User.findOne({ userId: userId.trim() });
  if (!user) return res.status(404).json({ error: 'not_found' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ ok: true });
});

module.exports = router;
