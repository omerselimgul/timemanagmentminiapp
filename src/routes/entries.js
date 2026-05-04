const router = require('express').Router();
const Entry = require('../models/Entry');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res) => {
  const entries = await Entry.find({ userId: req.user.userId }).sort({ date: -1, createdAt: -1 }).lean();
  res.json(entries);
});

router.post('/', async (req, res) => {
  const { date, name, cat, min, startTime, endTime } = req.body;
  if (!date || !name || !cat || !min || !startTime || !endTime)
    return res.status(400).json({ error: 'missing_fields' });

  const entry = await Entry.create({ userId: req.user.userId, date, name, cat, min, startTime, endTime });
  res.status(201).json(entry);
});

router.put('/:id', async (req, res) => {
  const entry = await Entry.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { $set: req.body },
    { new: true },
  );
  if (!entry) return res.status(404).json({ error: 'not_found' });
  res.json(entry);
});

router.delete('/:id', async (req, res) => {
  const entry = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  if (!entry) return res.status(404).json({ error: 'not_found' });
  res.json({ ok: true });
});

module.exports = router;
